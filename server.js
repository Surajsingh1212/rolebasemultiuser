require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose')
mongoose.connect('mongodb://127.0.0.1:27017/multiUserSystem')

const port = process.env.SERVER_PORT | 3000

app.use(express.json())
app.use(express.static('public'))

const authRoute = require('./routes/authRoute')

app.use('/api',authRoute)

app.listen(port,()=>{
    console.log("Server running on port "+port)
})