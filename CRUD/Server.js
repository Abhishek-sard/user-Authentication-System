import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";


dotenv.config();
const app = express();

//Middlewares
app.use(cors());
app.use(express.json());

//Routes
app.get("/todos", todoRoutes);

//MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true, useNewUrlParser:true})
.then(()=> {
    console.log("MongoDB Connected");
    app.listen(5000, ()=> console.log("Server running on http://localhost:5000"));
})
.catch((err => console.log(err)));