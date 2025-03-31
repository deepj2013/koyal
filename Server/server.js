import express from 'express'
import mongoose from 'mongoose'
import cors from "cors"
import { config } from './config.js'
import dotenv from "dotenv";
import color from "colors";
import { Server } from 'socket.io';
import { createServer } from 'http';


dotenv.config({ silent: process.env.NODE_ENV === 'production' });
import { returnError } from './exception/errorHandler.js';

//importing routes
import temp from './temp.js'
import publicRoutes from './routes/publicRoutes.js'
import adminRoutes from './routes/adminRoutes.js'
import userRoutes from './routes/userRoutes.js'
import { createUserFolder } from './services/s3Service.js';

const port = 5001

const app = express()
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});
app.options("*", cors({ origin: '*', optionsSuccessStatus: 200 }));
app.use(cors({ origin: "*", optionsSuccessStatus: 200 }));
app.use(express.json())
mongoose.set('strictQuery', false);

// Socket.IO connection handling
io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});


mongoose
  .connect(config.conn)
  .then(() => {
    console.log( '__________________________________________________________________________________')
    console.log('|' + color.green.bold(` Mongo DB Connected Successfully.. |`) + '|')
  }).catch((err) => console.error("MongoDB connection error:", err));



// Define Your Routes Here
app.use('/', temp)
app.use('/api/public', publicRoutes)
app.use('/api/admin', adminRoutes)
app.use("/api/user", userRoutes)


app.get('/', (req, res) => { 
  res.send('Hello World, from express.');
});

app.use(returnError);

app.listen(process.env.PORT || port, () => {
  console.log('__________________________________________________________________________________')
  console.log('|' + color.green.bold(` $Server is running on: | http://localhost:${process.env.PORT} |`) + '|')
  //console.log(`Server started at ${port}`)
})