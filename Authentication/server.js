const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
require("dotenv").config();

// Import routes
const authRoutes = require("./routes/authRoutes");

//Import middleware
const { errorHandler } = require("./middleware/errorMiddleware");

const app = express();

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

//Routes
app.use("/api/auth", authRoutes);

//Error handling middleware
app.use(errorHandler);

//connect to mongoDB
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/mern-auth")
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
