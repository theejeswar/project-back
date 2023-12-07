require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/connectDB');

const app = require('./app');
const PORT = process.env.PORT || 3500;
connectDB();

mongoose.connection.once("open",()=>{
    console.log('COnnected to MongoDB');
    app.listen(PORT, ()=>console.log(`Server successfully running at ${PORT} port`));
})