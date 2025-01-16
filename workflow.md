
# Cryptocurrency Price Monitoring and Alerting System

## 1. Introduction
This document provides an overview of the application flow for the cryptocurrency price monitoring and alerting system. It also outlines the challenges encountered during development and the solutions implemented to address them.

## 2. Application Flow

### Frontend
The frontend is built with **Next.js** to ensure fast rendering and a seamless user experience. Below is the step-by-step flow:

#### Homepage
The homepage displays popular cryptocurrencies with basic details:
- Name
- Current price
- 24-hour price change  
It also includes a chart representation of price trends for the day and allows users to search for specific cryptocurrencies.

#### Explore Page
The explore page displays a list of coins with:
- Name
- Market cap
- Current price
- Price changes for various periods (7 days, 30 days, 1 year, and today’s percentage change)  
Clicking on a coin redirects users to its detailed product page.

#### Product Page (Coin Details)
This page provides detailed information about the selected cryptocurrency, including:
- Current price
- Market cap
- 24-hour low and high prices
- All-time low (ATL) and all-time high (ATH) prices  
It features interactive charts displaying price trends for different periods (1 day, 7 days, 30 days, 1 year) and performance comparisons over predefined timeframes.

#### Set Alerts (on the Product Page)
Users can set price alerts via email by:
- Inputting their email address
- Defining a minimum and maximum price range  
The system validates the inputs and sends the alert data to the backend for processing.

#### Chart Rendering
The charts are rendered dynamically using **Chart.js**, which visualizes price trends based on data fetched from APIs.

#### Environment Variables
The frontend uses a `.env` file to securely store sensitive keys, such as the base URL for API endpoints and configurations for backend service connections.

---

### Backend
The backend, powered by **Node.js** and **Express**, performs the following functions:

#### Cryptocurrency Data Fetching
The backend fetches data from the **CoinGecko API** for:
- Cryptocurrency details
- Historical price data for charts

#### Alerts Management
The backend stores alert configurations (email, coin ID, price range) in **MongoDB**. It also monitors cryptocurrency prices and triggers email alerts via **Node-Cron**.

#### APIs
The backend provides APIs to the frontend for:
- Fetching coin suggestions based on search queries
- Retrieving coin details by ID
- Getting market cap data for all coins
- Fetching historical price data for predefined timeframes (1 day, 7 days, 30 days, etc.)
- Setting and verifying alerts

#### Environment Variables

Here is the list of environment variables that need to be configured in the backend `.env` file:

- `MONGO_URI=mongodb+srv://teju:<your_password>@crypto.sbgkp.mongodb.net/?retryWrites=true&w=majority&appName=crypto`
- `COINGECKO_API_URL=https://api.coingecko.com/api/v3`
- `COINGECKO_API_KEY=you_api_key`
- `REDIS_PASSWORD=redis_password`
- `EMAIL_USER=hello@example.com`
- `EMAIL_PASS=you_password`

Make sure to replace the placeholders with your actual values:
- `<your_password>`: Your MongoDB password.
- `you_api_key`: Your CoinGecko API key.
- `redis_password`: Your Redis password.
- `hello@example.com`: Your email address for sending alerts.
- `you_password`: Your email password (ensure to handle it securely).


---

## 3. Challenges Faced and Solutions

### Challenge 1: API Rate Limiting
**Problem:** The CoinGecko API enforces rate limits, causing issues with frequent data fetching.  
**Solution:**  
- Implemented caching using **Redis** to temporarily store frequently accessed data.
- Reduced redundant API calls by caching historical price data for charts.

### Challenge 2: Real-time Alert Monitoring
**Problem:** Continuous monitoring of price changes for multiple coins can be resource-intensive.  
**Solution:**  
- Used **Node-Cron** to schedule periodic checks instead of continuous monitoring.
- Batching requests for multiple coin prices helped reduce overhead.

### Challenge 3: Frontend Performance Optimization
**Problem:** Rendering large datasets (e.g., historical price charts) slowed down the UI.  
**Solution:**  
- Implemented lazy loading for components.
- Optimized chart rendering by limiting data points based on selected timeframes.

### Challenge 4: Managing State Across Components
**Problem:** Sharing state (e.g., selected coin, time range) across multiple components was cumbersome.  
**Solution:**  
- Used the **React Context API** to efficiently manage global state.

### Challenge 5: Alert Notification Failures
**Problem:** Emails were occasionally flagged as spam or failed to deliver.  
**Solution:**  
- Configured **SendGrid** with verified sender domains.
- Added retries and fallback mechanisms for failed email notifications.

---

## 4. Features Summary

### Core Features
- Real-time cryptocurrency data.
- Interactive price charts.
- Email-based price alerts.
- Performance insights over various timeframes.

### Additional Enhancements
- Fully responsive design.
- User-friendly navigation.
- Optimized for speed and scalability.

---

## 5. Conclusion
This project combines a robust backend with an interactive frontend to deliver a comprehensive cryptocurrency monitoring experience. By overcoming challenges such as API rate limiting, real-time monitoring, and alert notification failures, we ensured smooth performance and reliability.

---

