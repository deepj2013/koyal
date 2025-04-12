// socketHandler.js
import jwt from "jsonwebtoken";
import { audioprocessedSocket, lyricsProcessedSocket } from "../controllers/aiController.js"
import User from "../models/userModel.js";
import { toObjectId } from "../utils/mongo.js";

export const socketHandler = (io) => {
    io.use(async (socket, next) => {
        const token = socket.handshake.auth.token;
        if (!token) {
            socket.emit("authentication-error", { message: "Authentication error" });
            console.log("token not found")
            return next(new Error("Authentication error"));
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
            const user = await User.findOne({ _id: toObjectId(decoded.userId) })
            if (!user) {
                console.log("user not found")
                return next(new Error("User not found"));
            }
            socket.user = user;
            
            console.log("user details--->", socket.user)
            next();
        } catch (err) {
            return next(new Error("Invalid token"));
        }
    });

    io.on("connection", (socket) => {
        console.log("Client connected:", socket.id)
        console.log("Authenticated User--->", socket.user)

        socket.on("start-audio-processing", (data) => {
            audioprocessedSocket({ ...data, socket, socketId: socket.id, user: socket.user })
        })

        socket.on("lyrics-edit-request", (data) => {
            console.log("lyrics-edit-request", data)
            lyricsProcessedSocket({ ...data, socket, socketId: socket.id, user: socket.user })
        })

        socket.on("disconnect", () => {
            console.log("Client disconnected:", socket.id)
        })
    })
}
