import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import authRoute from './Routes/auth.js';
import postRoute from './Routes/posts.js';
import userRoute from './Routes/users.js';
import { fileURLToPath } from 'url'; // Import the fileURLToPath function
import path from 'path';

dotenv.config();

// Get the current module's file path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Midleware
const app = express()
app.use(express.json())

const corsOptions = {
  origin: 'http://localhost:5173',
  credentials: true, 
};

app.use(cors(corsOptions));



// STORAGE MULTER
const uploadDir = '../client/public/upload'; 
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});


const upload = multer({ storage: storage });

app.post('/api/upload', upload.single("file"), (req, res) => {
  try {
    const file = req.file;
    res.status(200).json(file.filename); 
  } catch (error) {
    res.status(500).json(error); 
  }    
});

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