import express from "express";
import { createServer } from "node:http";

import { Server } from "socket.io";

import { userRouter } from "./Routes/user.models.js";

import mongoose from "mongoose";

import cors from "cors";

const app = express();
const server = createServer (app);
const io = new Server (server);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/users", userRouter);

app.set("port", (process.env.PORT || 8000))


app.get ("/home", (req,res) =>{
    return res.json({"hello": "World"})
});



const start = async () => {
    app.set("mongo_user")
    const connectiondb = await mongoose.connect("mongodb+srv://ritualreflection005_db_user:HarshUpadhyay0511@clustermeetconnect.hf3ri0y.mongodb.net/")
    console.log(`MONGO Connected DB Host: ${connectiondb.connection.host}`);

    server.listen(app.get("port"), () => {
        console.log("listening on port 8000");
    });
}


start();

