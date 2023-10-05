import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import authRoute from './Routes/auth.js';
import postRoute from './Routes/posts.js';
import userRoute from './Routes/users.js';
dotenv.config();

// Midleware
const app = express()
app.use(express.json())
app.use(cors())


// Routes
app.use("/api/users",userRoute)
app.use("/api/auth",authRoute)
app.use("/api/posts",postRoute)

// Mongo Db Connection
mongoose.connect(process.env.MONGO_DB)
.then(()=>console.log("MONGODB Connected"))
.catch((err)=>console.log("mongo db failed to coonect",err))


app.listen(8800,()=>{
    console.log("API Working")
})