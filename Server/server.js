import express from 'express'
import mongoose from 'mongoose'
import { config } from './config.js'
import dotenv from "dotenv";
import color from "colors";
import { Server } from 'socket.io';
import { createServer } from 'http';
import { returnError } from './exception/errorHandler.js';
import router from './routes.js';
import { getErrorLogs } from './controllers/errorLogController.js';

dotenv.config({ silent: process.env.NODE_ENV === 'production' });

const port = 5001

const app = express()
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});
// Socket.IO connection handling
io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

mongoose.set('strictQuery', false);
mongoose
  .connect(config.conn)
  .then(() => {
    console.log('__________________________________________________________________________________')
    console.log('|' + color.green.bold(` Mongo DB Connected Successfully.. |`) + '|')
  }).catch((err) => console.error("MongoDB connection error:", err));

app.get("/error/getLog", getErrorLogs);

app.use(router);

app.use(returnError);

app.listen(process.env.PORT || port, () => {
  console.log('__________________________________________________________________________________')
  console.log('|' + color.green.bold(` $Server is running on: | http://localhost:${process.env.PORT} |`) + '|')
})