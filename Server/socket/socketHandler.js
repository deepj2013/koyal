import jwt from "jsonwebtoken";
import { audioprocessedSocket, avatarServiceSocket, editSceneSocket, generateFinalVideoSocket, generateFinalVideoWithPromptSocket, lyricsProcessedSocket, selectStyleSocket, themeCharacterSocket } from "../controllers/aiController.js"
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
        socket.on("lyrics-edit-processing", (data) => {
            console.log("lyrics-edit-request", data)
            lyricsProcessedSocket({ ...data, socket, socketId: socket.id, user: socket.user })
        })
        socket.on("theme-character-processing", (data) => {
            console.log("theme-character-request", data)
            themeCharacterSocket({ ...data, socket, socketId: socket.id, user: socket.user })
        })
        socket.on("start-avtar-processing", (data) => {
            console.log("avtar-process-request", data)
            avatarServiceSocket({ ...data, socket, socketId: socket.id, user: socket.user })
        })
        socket.on("style-processing-request", (data) => {
            console.log("style-process-request", data);
            selectStyleSocket({ ...data, socket, socketId: socket.id, user: socket.user })
        })
        socket.on("edit-scene-processing-request", (data) => {
            console.log("edit-scene-processing-request", data);
            editSceneSocket({ ...data, socket, socketId: socket.id, user: socket.user })
        })
        socket.on("generate_video-request", (data) => {
            console.log("generate_video", data);
            generateFinalVideoSocket({ ...data, socket, socketId: socket.id, user: socket.user })
        })
        socket.on("generate_video_with_prompt-request", (data) => {
            console.log("generate_video_with_prompt", data);
            generateFinalVideoWithPromptSocket({ ...data, socket, socketId: socket.id, user: socket.user })
        })
        socket.on("disconnect", () => {
            console.log("Client disconnected:", socket.id)
        })
    })
}
