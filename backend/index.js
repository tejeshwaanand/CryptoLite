const express = require('express');
const coinRoutes = require('./routes/coinRoutes');
const alertRoutes = require('./routes/alertRoutes')
const dotenv = require('dotenv');
const connectDB =require('./config/db')
const cron = require('node-cron');
const { checkAlerts } = require('./controllers/alertController'); 
const cors = require('cors');

// Allow requests from the frontend


// Schedule checkAlerts to run every minute (you can adjust the interval)
cron.schedule('*/5 * * * *', checkAlerts); // This runs every minute


// Initialize dotenv for environment variables
dotenv.config();

const app = express();

connectDB();

// Middleware
app.use(express.json());

app.use(cors());

// Routes
app.use('/api', coinRoutes); // Use '/api' as the base URL for coin-related routes
app.use('/api', alertRoutes);
// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
