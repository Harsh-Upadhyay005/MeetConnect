import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import { userRouter } from "./Routes/user.models.js";
import { connectToSocket } from "./controllers/SocketManager.js";
import mongoose from "mongoose";
import cors from "cors";

const app = express();
const server = createServer(app);
const io = connectToSocket(server);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/users", userRouter);

app.set("port", (process.env.PORT || 8000));

app.get("/home", (req, res) => {
    return res.json({ "hello": "World" });
});

const start = async () => {
    try {
        const mongoUri = process.env.MONGO_URI || "mongodb+srv://ritualreflection005_db_user:HarshUpadhyay0511@clustermeetconnect.hf3ri0y.mongodb.net/MeetConnect";
        const connectiondb = await mongoose.connect(mongoUri);
        console.log(`MONGO Connected DB Host: ${connectiondb.connection.host}`);

        server.listen(app.get("port"), () => {
            console.log(`Server listening on port ${app.get("port")}`);
        });
    } catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
};

start();