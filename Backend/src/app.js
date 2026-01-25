import express from "express";
import { createServer } from "node:http";

import { Server } from "socket.io";

import mongoose from "mongoose";

import cors from "cors";

const app = express();
const server = createServer (app);
const io = new Server (server);
app.use(cors());

app.set("port", (process.env.PORT || 8000))


app.get ("/home", (req,res) =>{
    return res.json({"hello": "World"})
});

const start = async () => {
    app.set("mongo_user")
    const connectiondb = await mongoose.connect("mongodb+srv://harsh05_db_user:<WQY5auAPCihg0MPC>@clusterdb.sla0dza.mongodb.net/")
    console.log(`MONGO Connected DB Host: ${connectiondb.connection.host}`);

    server.listen(app.get("port"), () => {
        console.log("listening on port 8000");
    });
}


start();
