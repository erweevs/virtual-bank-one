const express = require('express');
const dotenv = require('dotenv');

// load the env variables
dotenv.config({path: './config/config.env'});

const app = express();

app.get('/api/v1/users', (req, res) => {
    res.status(200).json({success: true, message: 'Fetch all users'});
});

app.get('/api/v1/users/:id', (req, res) => {
    res.status(200).json({success: true, message: `Fetch user with id ${req.params.id}`});
});

app.post('/api/v1/users', (req, res) => {
    res.status(200).json({success: true, message: 'Add a new User'});
});

app.put('/api/v1/users/:id', (req, res) => {
    res.status(200).json({success: true, message: `Update User: ${req.params.id}`});
});

app.delete('/api/v1/users/:id', (req, res) => {
    res.status(200).json({success: true, message: `Deleting User: ${req.params.id}`});
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server listening on port ${process.env.NODE_ENV} ${PORT}`);
});