const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');


//Import Routes
const authRoute = require('./routes/auth')
const postRoute = require('./routes/posts')

//Config
dotenv.config();
mongoose.set('strictQuery', true);
//Connect DB
mongoose.connect(process.env.DB_CONNECT, ()  => {
    console.log('connected to db!'); 
});
//Middleware
app.use(express.json());


//Route Middlewares
app.use('/api/user', authRoute);
app.use('/api/posts', postRoute);



//Listen Server
app.listen(3000, () => console.log('Server is running!'));