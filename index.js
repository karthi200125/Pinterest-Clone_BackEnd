import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import helmet from 'helmet'
import morgan from 'morgan'
import userRoute from './Routes/users.js'
import authRoute from './Routes/auth.js'
import postRoute from './Routes/posts.js'
import multer from 'multer'
dotenv.config();

// Midleware
const app = express()
app.use(express.json())
app.use(cors())
app.use(helmet())
app.use(morgan("common"))


// STORAGE MULTER
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, '../client/public/upload')
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + file.originalname)
    }
  });
  
  const upload = multer({ storage: storage });
  
  app.post('/api/upload', upload.single("file"), (req, res) => {
    const file = req.file;
    res.status(200).json(file.filename);
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