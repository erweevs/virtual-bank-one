const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');

const users = require('./routes/users');
const connectToDb = require('./config/db');

// load the env variables
dotenv.config({path: './config/config.env'});

// connect to the DB
connectToDb();

const app = express();

// dev logging middleware
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
}

// mount the Users route
app.use('/api/v1/users', users);

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