import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import http from "http";
import { connectDB } from './lib/db.js';
import userrouter from './routes/userRoutes.js';
import messageRouter from './routes/messageRoutes.js';
import { Server } from 'socket.io';

//Create Express App and HTTP Server
const app = express();
const server = http.createServer(app);


//Initialize socket.io
export const io = new Server(server,{
  cors:{origin:"*"}
})

//store online users
export const userSocketMap = {};

//socket.io connection handler
io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  console.log("User Connected", userId);
  if (userId) userSocketMap[userId] = socket.id;
});

//MiddleWare setup

app.use(cors());
app.use(express.json({limit:"4mb"}));

//Route setup
app.use("/api/status",(req,res)=> res.send("Server is Live"));
app.use('/api/auth',userrouter);
app.use('/api/messages',messageRouter)

//connect to mongodb
await connectDB();


const PORT = process.env.PORT || 5000;
server.listen(PORT,()=> console.log("Server is Running "+PORT));
