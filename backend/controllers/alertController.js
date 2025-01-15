const Alert = require('../models/alert'); // Assuming you have an Alert model
const { sendAlertEmail } = require('../utils/emailServices'); // Service for sending emails



const fetchCoinPriceHelper = async (coinId) => {
  const url = `https://api.coingecko.com/api/v3/coins/${coinId}`;
  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'x-cg-api-key': process.env.COINGECKO_API_KEY, // Optional key
    },
  };

  try {
    const response = await fetch(url, options);
    if (!response.ok) throw new Error(`Failed to fetch data for ${coinId}, status: ${response.status}`);
    const coinData = await response.json();
    return coinData.market_data.current_price.usd;
  } catch (error) {
    console.error('Error fetching coin data:', error.message);
    throw error;
  }
};


// / Set a new price alert
exports.setAlert = async (req, res) => {
  try {
    const { email, coinId, minPrice, maxPrice } = req.body;

    // Validate input
    if (!email || !coinId || !minPrice || !maxPrice) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Save the alert to the database
    const newAlert = new Alert({
      email,
      coinId,
      minPrice,
      maxPrice,
      active: true, 
      createdAt: new Date(),
    });

    await newAlert.save();


    return res.status(201).json({ message: 'Alert created successfully', alert: newAlert });
  } catch (error) {
    console.error('Error creating alert:', error);
    return res.status(500).json({ error: 'Failed to create alert', details: error.message });
  }
};

// Get all alerts for a user
// exports.getAlerts = async (req, res) => {
//   try {
//     // Fetch all active alerts from the database for the given email
//     const alerts = await Alert.find({ email: req.query.email, active: true });

//     return res.status(200).json(alerts);
//   } catch (error) {
//     console.error('Error fetching alerts:', error);
//     return res.status(500).json({ error: 'Failed to fetch alerts', details: error.message });
//   }
// };

// Check alerts and send email when conditions are met (to be run periodically)
exports.checkAlerts = async () => {
  try {
    const alerts = await Alert.find({ active: true }); // Fetch all active alerts from the database
    console.log(alerts.length)
    for (let alert of alerts) {
      const { email, coinId, minPrice, maxPrice } = alert;
      

      // Fetch the current coin data using fetchCoinPriceById function
      const currentPrice = await fetchCoinPriceHelper(coinId); // Get the current USD price from response
      // const currentPrice = 0;
      console.log(currentPrice);
      console.log(email);
      // Check if the price matches the alert criteria
      if (currentPrice <= minPrice ) {
        const msg ="Current Price Hit Minimum set Price !!!"
        sendAlertEmail(email, coinId, currentPrice,msg); // Send email if condition is met
        alert.active = false; // Deactivate the alert after it's triggered
        await alert.save(); // Save the updated alert to the database
      }
      else if(currentPrice >= maxPrice ){
        const msg ="Current Price Hit Maximum set Price !!!"
        sendAlertEmail(email, coinId, currentPrice,msg); // Send email if condition is met
        alert.active = false; // Deactivate the alert after it's triggered
        await alert.save();
      }
    }
  } catch (error) {
    console.error('Error checking alerts:', error);
  }
};



