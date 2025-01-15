const express = require('express');
const alertController = require('../controllers/alertController');
const router = express.Router();

// Route to create a new alert
router.post('/set-alert', alertController.setAlert);

// Route to fetch all alerts for a user (optional)
// router.get('/alerts', alertController.getAlerts);


router.get('/check-alert', alertController.checkAlerts);

module.exports = router;
