const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const morgan = require('morgan');
const mongoose = require('mongoose');

// Import routes
const userRoutes = require('./Routes/userRoutes');
const themesRoutes = require('./Routes/themesRoutes');
const packageRoutes = require('./Routes/packageRoutes');
const bookingRoutes = require('./Routes/bookingRoutes');
const paymentRoutes = require('./Routes/paymentRoutes');

// Load environment variables
dotenv.config();

// Create an instance of Express
const app = express();

// Middleware
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded request bodies
app.use(morgan('dev')); // Log HTTP requests

// Connect to MongoDB Atlas
const mongoURI = process.env.MONGODB_URL;

const connectToMongoDB = async () => {
  try {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB Atlas');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1); // Exit the application if unable to connect
  }
};
connectToMongoDB();

// Use routes
app.use('/api/users', userRoutes);
app.use('/api/themes', themesRoutes);
app.use('/api/packages', packageRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api', paymentRoutes);

// Static folder for uploaded files
app.use('/uploads', express.static('uploads'));

// Root endpoint
app.get('/', (req, res) => {
  res.send('Welcome to the Express.js API!');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: err.message || 'Something went wrong!',
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
