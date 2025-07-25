const mongoose = require('mongoose');

const connectDB = async () => {
    try{
        await mongoose.connect(process.env.MONGO_URL, {
            dbName: 'data'
        });
        console.log('MongoDB connected');
    } catch(err){
        console.error(`Error: ${err.message}`);
        process.exit(1);
    }
};


module.exports = connectDB;
