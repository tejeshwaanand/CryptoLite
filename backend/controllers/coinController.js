const axios = require('axios');
const { getCache, setCache } = require('../services/redisCache');


const COINGECKO_API_URL = 'https://api.coingecko.com/api/v3';


// Fetch the list of coins and details 1day, 7day , 1month ,1year
exports.fetchCoinsMarketCap = async (req, res) => {
  const page = req.query.page || 1;
  const perPage = req.query.perPage || 20;

  const cacheKey = `coinsMarketCap_page_${page}_perPage_${perPage}`;

  try {
    // Check if data exists in cache
    const cachedData = await getCache(cacheKey);

    if (cachedData) {
      console.log('Returning cached data.');
      return res.status(200).json(cachedData);
    }

    // API request options
    const url = `${COINGECKO_API_URL}/coins/markets`;
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-cg-api-key': process.env.COINGECKO_API_KEY, // Add API key
      },
      params: {
        vs_currency: 'usd',
        order: 'market_cap_desc',
        page: page,
        per_page: perPage,
        price_change_percentage: '24h,7d,30d,1y',
      },
    };

    // Make API request
    const response = await axios(url, options);

    // Cache the data in Redis for 5 min
    await setCache(cacheKey, response.data, 300);

    console.log('Returning fresh data.');
    return res.status(200).json(response.data);
  } catch (error) {
    console.error('Error fetching coins market cap:', error.message);
    return res.status(500).json({
      error: 'Failed to fetch coins market cap data',
      details: error.message,
    });
  }
};


//fetch Chart of MarketCap 

exports.fetchChartMarketCap = async (req, res) => {
  const { selectedCoin } = req.params; // Correctly destructure selectedCoin from req.params
  const now = new Date();
  const startOfDay =
    new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime() / 1000;
  const endOfDay = startOfDay + 24 * 60 * 60;

  try {
    // Create a unique cache key based on selectedCoin, startOfDay, and endOfDay
    const cacheKey = `marketCap_${selectedCoin}_${startOfDay}_${endOfDay}`;

    // First check if the chart data is available in Redis cache
    const cachedChartData = await getCache(cacheKey);
    if (cachedChartData) {
      // If cached data exists, return it directly
      return res.status(200).json(JSON.parse(cachedChartData));
    }

    // CoinGecko API URL and options
    const url = `${COINGECKO_API_URL}/coins/${selectedCoin}/market_chart/range?vs_currency=usd&from=${startOfDay}&to=${endOfDay}`;

    // Make the API request to CoinGecko
    const response = await axios.get(url, {
      headers: {
        'Content-Type': 'application/json',
        'x-cg-api-key': process.env.COINGECKO_API_KEY, // Make sure the API key is available in the .env file
      },
    });

    // Cache the market cap data in Redis for 10 minutes
    await setCache(cacheKey, JSON.stringify(response.data), 600); // TTL of 600 seconds = 10 minutes

    // Return the fresh data
    return res.status(200).json(response.data);
  } catch (error) {
    console.error('Error fetching the market cap chart data:', error);
    return res.status(500).json({
      error: 'Failed to fetch market cap chart data',
      details: error.message,
    });
  }
};



//suggetion api
exports.fetchSuggestion = async (req, res) => {
  try {
    // Get the search query from request parameters or body
    const { search } = req.query;

    if (!search) {
      return res.status(400).json({ error: 'Search query is required' });
    }

    // Check if the suggestions are cached in Redis
    const cachedSuggestions = await getCache(`suggestions:${search}`);

    // If suggestions are cached, return them directly
    if (cachedSuggestions) {
      return res.status(200).json(JSON.parse(cachedSuggestions)); // Return cached suggestions
    }

    // CoinGecko API URL with search query
    const url = `https://api.coingecko.com/api/v3/search?query=${search}`;
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-cg-api-key': process.env.COINGECKO_API_KEY, // API key from environment variables
      },
    };

    // Make the API request to CoinGecko
    const response = await axios.get(url, options);

    // Extract the top 7 coins from the response
    const suggestions = response.data.coins.slice(0, 7);

    // Cache the suggestions in Redis for 10 minutes
    await setCache(`suggestions:${search}`, JSON.stringify(suggestions), 60); // TTL of 60 seconds = 1 minutes

    // Return the suggestions to the client
    return res.status(200).json(suggestions);
  } catch (error) {
    console.error('Error fetching suggestions:', error.message);
    return res.status(500).json({ error: 'Failed to fetch suggestions', details: error.message });
  }
};



// Fetch a single coin's data by its ID
exports.fetchCoinDataById = async (req, res) => {
  try {
    const { id } = req.params; // Extract the coin ID from the request parameters

    // Check if the data is available in Redis cache
    const cachedCoinData = await getCache(`singlecoinData:${id}`);
    if (cachedCoinData) {
      console.log(`Cache hit for coin ID: ${id}`);
      return res.status(200).json(JSON.parse(cachedCoinData)); // Return cached data
    }

    console.log(`Cache miss for coin ID: ${id}, fetching from CoinGecko API`);

    // CoinGecko API URL and options
    const url = `https://api.coingecko.com/api/v3/coins/${id}`;
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-cg-api-key': process.env.COINGECKO_API_KEY, // Access API key from .env file
      },
    };

    // Fetch data from CoinGecko API
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`Failed to fetch coin data. Status: ${response.status}`);
    }

    const coinData = await response.json(); // Parse the response as JSON

    // Cache the fetched data in Redis for 10 minutes
    await setCache(`singlecoinData:${id}`, JSON.stringify(coinData), 60); // TTL = 60 seconds = 1 minutes

    return res.status(200).json(coinData); // Return the fresh data
  } catch (error) {
    console.error('Error fetching coin data by ID:', error.message);
    return res.status(500).json({ error: 'Failed to fetch coin data', details: error.message });
  }
};






//fetchCoinDataByDays

exports.fetchCoinDataByDays = async (req, res) => {
  try {
    const { day, id } = req.params;

    // Check if the data is cached in Redis
    const cacheKey = `coinData:${id}:${day}`;
    const cachedData = await getCache(cacheKey);

    if (cachedData) {
      return res.status(200).json(JSON.parse(cachedData)); // Return cached data
    }

    // Make the API call to fetch data
    const response = await axios.get(`${COINGECKO_API_URL}/coins/${id}/market_chart?days=${day}`, {
      
      params: {
        vs_currency: 'usd',
        // days: day,
        precision: 2,
      },
      headers: {
        'Content-Type': 'application/json',
        'x-cg-api-key': process.env.COINGECKO_API_KEY, // Use the API key from the .env file
      },
    });

    const coinData = response.data;

    // Cache the data in Redis for 1 minutes
    await setCache(cacheKey, JSON.stringify(coinData), 60); // TTL = 60 seconds

    return res.status(200).json(coinData); // Return fresh data
  } catch (error) {
    console.error('Error fetching coin data by days:', error.message);
    return res.status(500).json({ error: 'Failed to fetch coin data', details: error.message });
  }
};

exports.fetchCoinPriceById = async (req, res) => {
  
  try {
    const { id } = req.params; // Extract the coin ID from the request parameters

    // Check if the data is available in Redis cache
    const cachedCoinData = await getCache(`coinprice:${id}`);
    if (cachedCoinData) {
      console.log(`Cache hit for coin ID: ${id}`);
      return res.status(200).json(JSON.parse(cachedCoinData)); // Return cached data
    }

    console.log(`Cache miss for coin ID: ${id}, fetching from CoinGecko API`);

    // CoinGecko API URL and options
    const url = `https://api.coingecko.com/api/v3/coins/${id}`;
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-cg-api-key': process.env.COINGECKO_API_KEY, // Access API key from .env file
      },
    };

    // Fetch data from CoinGecko API
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`Failed to fetch coin data. Status: ${response.status}`);
    }
    
    const coindata = await response.json(); // Parse the response as JSON
    
    const currentPrice = coindata.market_data.current_price.usd;
    // Cache the fetched data in Redis for 5 sec
    await setCache(`coinprice:${id}`, JSON.stringify(currentPrice), 600); // TTL = 5 seconds 

    return res.status(200).json(currentPrice); // Return the fresh data
  } catch (error) {
    console.error('Error fetching coin data by ID:', error.message);
    return res.status(500).json({ error: 'Failed to fetch coin data', details: error.message });
  }
};

// fetchCompanyHoldings
exports.fetchCompanyHoldings = async (req, res) => {
  try {
    const { coin } = req.params; // Extract the coin ID from the request parameters

    // Check if the data is available in Redis cache
    const cachedCoin = await getCache(`coinholding:${coin}`);
    if (cachedCoin) {
      console.log(`Cache hit for coin ID: ${coin}`);
      return res.status(200).json(JSON.parse(cachedCoin)); // Return cached data
    }

    console.log(`Cache miss for coin ID: ${coin}, fetching from CoinGecko API`);

    // CoinGecko API URL and options
    const url = `${COINGECKO_API_URL}/companies/public_treasury/${coin}`;
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-cg-api-key': process.env.COINGECKO_API_KEY, // Access API key from .env file
      },
    };

    // Fetch data from CoinGecko API
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`Failed to fetch company holding data. Status: ${response.status}`);
    }

    const coincompany = await response.json(); // Parse the response as JSON

    // Cache the fetched data in Redis for 10 minutes
    await setCache(`coinholding:${coin}`, JSON.stringify(coincompany), 600); // TTL = 600 seconds = 10 minutes

    return res.status(200).json(coincompany); // Return the fresh data
  } catch (error) {
    console.error('Error fetching company holding data', error.message);
    return res.status(500).json({ error: 'Failed to fetch company holding data', details: error.message });
  }
};


