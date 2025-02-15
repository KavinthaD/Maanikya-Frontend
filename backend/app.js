const express = require('express');
const connectDB = require('./db');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware and routes setup
app.use(express.json());

// Example route
app.get('/', (req, res) => {
  res.send('Hello, MongoDB!');
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});