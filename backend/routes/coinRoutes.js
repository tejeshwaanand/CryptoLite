const express = require('express');
const router = express.Router();
const coinController = require('../controllers/coinController');

// Route to fetch the list of coins
router.get('/coins/markets', coinController.fetchCoinsMarketCap);

// Route to fetch the list of coins suggetion 
router.get('/fetchSuggestion', coinController.fetchSuggestion);

// Route to fetch the coins details by id
router.get('/coindata/:id',coinController.fetchCoinDataById);


// Route to fetch the coins details chart by id
router.get('/coinchart/:selectedCoin',coinController.fetchChartMarketCap);



// Route to fetch the coins details by day
router.get('/coin-data/:id/:day',coinController.fetchCoinDataByDays);

// Route to fetch current price of a specific coin by its ID
router.get('/coins-price/:id', coinController.fetchCoinPriceById);


//company holding data
router.get('/company-holding/:coin', coinController.fetchCompanyHoldings);

module.exports = router;
