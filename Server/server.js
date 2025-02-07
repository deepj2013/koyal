import express from 'express'
import mongoose from 'mongoose'
import cors from "cors"
import { config } from './config.js'
import dotenv from "dotenv";


dotenv.config({ silent: process.env.NODE_ENV === 'production' });
import { returnError } from './exception/errorHandler.js';

//importing routes

import publicRoutes from './routes/publicRoutes.js'
import adminRoutes from './routes/adminRoutes.js'
// import dummyRoutes from './src/routes/dummyRoutes.js'


const port = 5001

const app = express()
app.options("*", cors({ origin: '*', optionsSuccessStatus: 200 }));
app.use(cors({ origin: "*", optionsSuccessStatus: 200 }));
app.use(express.json())
mongoose.set('strictQuery', false);



mongoose
  .connect(config.conn)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB connection error:", err));



// Define Your Routes Here
app.use('/api/public', publicRoutes)
app.use('/api/admin', adminRoutes)
// app.use('/dummy', dummyRoutes )
  
app.get('/', (req, res) => {
    res.send('Hello World, from express.');
});

app.use(returnError);

app.listen(port, () => {
    console.log(`Server started at ${port}`)
})