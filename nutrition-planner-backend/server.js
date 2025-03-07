require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require('./routes/authRoutes');

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB - Fixed connection without deprecated options
mongoose.connect(process.env.MONGODB_URI, {
    connectTimeoutMS: 30000,
    socketTimeoutMS: 45000,
    maxPoolSize: 50,
    retryWrites: true,
    retryReads: true
})
.then(() => console.log("✅ MongoDB Connected"))
.catch((err) => console.error("❌ MongoDB Connection Error:", err));

// Use routes
app.use('/api/auth', authRoutes);

// Route to check if server is running
app.get('/', (req, res) => {
  res.send('NutriPlan API is running!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
