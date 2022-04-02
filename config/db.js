const mongoose = require('mongoose');

const connectToDb = async () => {
    const mongoConnection = await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

    console.log(`MongoDB Connected: ${mongoConnection.connection.host}`);
};

module.exports = connectToDb;