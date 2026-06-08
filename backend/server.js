const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const authRoutes = require("./routes/authRoutes");
const postRoutes = require("./routes/postRoutes");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());
// Static folder for images
app.use("/uploads", express.static("uploads"));

app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
