const express = require('express');
const dotenv = require('dotenv');
const users = require('./routes/users');

// load the env variables
dotenv.config({path: './config/config.env'});

const app = express();

// mount the Users route
app.use('/api/v1/users', users);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server listening on port ${process.env.NODE_ENV} ${PORT}`);
});