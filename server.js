const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const fileUpload = require('express-fileupload');
const path = require('path');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const xxs = require('xss-clean');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const cors = require('cors');

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

// add the cookie parser
app.use(cookieParser());

// dev logging middleware
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
}

// file upload middleware
app.use(fileUpload());

// sanitize data
app.use(mongoSanitize());

// set security headers
app.use(helmet());

// prevent xss attacks
app.use(xxs());

// rate limiting
const limiter = rateLimit({
    // set the rate to only allow 100 requests per 10 minutes
    windowMs: 10 * 60 * 1000, // 10minutes
    max: 100
});

app.use(limiter);

// prevent http param pollution
app.use(hpp());

// enable CORS
app.use(cors());

// set static folder for the photos
app.use(express.static(path.join(__dirname, 'public')));

// mount the routes
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