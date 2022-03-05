const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const fileUpload = require('express-fileupload');
const path = require('path');

const usersRoute = require('./routes/users');
const accountsRoute = require('./routes/accounts');
const authRoute = require('./routes/auth');
const connectToDb = require('./config/db');
const errorHandler = require('./middleware/error');

// load the env variables
dotenv.config({path: './config/config.env'});

// connect to the DB
connectToDb();

const app = express();

// add the body parser
app.use(express.json());

// dev logging middleware
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
}

// file upload middleware
app.use(fileUpload());

// set static folder for the photos
app.use(express.static(path.join(__dirname, 'public')));

// mount the Users route
app.use('/api/v1/users', usersRoute);
app.use('/api/v1/accounts', accountsRoute);
app.use('/api/v1/auth', authRoute);

// add the custom error handler middleware (has to be after the controller mounting)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
    console.log(`Server listening on port ${process.env.NODE_ENV} ${PORT}`);
});

// handle unhandles promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`);

    // close the server
    server.close(() => {
        process.exit(1);
    });
});