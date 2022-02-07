const express = require('express');
const dotenv = require('dotenv');

// load the env variables
dotenv.config({path: './config/config.env'});

const server = express();

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server listening on port ${process.env.NODE_ENV} ${PORT}`);
});