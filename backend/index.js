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


const allowedOrigins = [
  'http://localhost:3000',
  'https://cryptolite-frontend.vercel.app'
];

// Middleware
app.use(express.json());

// app.use(cors());

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // enable if using cookies or Authorization headers
}));

// Routes

app.get("/",(req,res)=>{
  res.send("Server is running");
})

app.use('/api', coinRoutes); // Use '/api' as the base URL for coin-related routes
app.use('/api', alertRoutes);
// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
