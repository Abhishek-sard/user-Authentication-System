import express from 'express';
import mongoose  from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import blogRoutes from "./routes/blogRoutes.js";


dotenv.config();
const app = express();

//Middleware
app.use(cors());
app.use(express.json());

//Routes
app.use("/blogs", blogRoutes);

//mongodb connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => {
  console.log("✅ MongoDB Connected");
  app.listen(5000, () => console.log("🚀 Server running on http://localhost:5000"));
})
.catch(err => console.log(err));