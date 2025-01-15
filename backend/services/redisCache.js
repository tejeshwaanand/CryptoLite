const Redis = require('ioredis');
require('dotenv').config();

const redis = new Redis({
    host: 'redis-17848.crce179.ap-south-1-1.ec2.redns.redis-cloud.com',
    port: 17848,
    password: process.env.REDIS_PASSWORD,
    // No TLS option added, so it won't use TLS
});

// Function to get data from Redis cache
async function getCache(key) {
    try {
        const value = await redis.get(key);
        return value ? JSON.parse(value) : null;  // Parse value if it exists
    } catch (err) {
        console.error('Error getting cache:', err);
        throw new Error('Failed to get cache');
    }
}

// Function to set data in Redis cache
async function setCache(key, value, ttl = 600) {  // TTL defaults to 1 min
    try {
        await redis.setex(key, ttl, JSON.stringify(value));  // Store in cache with TTL
    } catch (err) {
        console.error('Error setting cache:', err);
        throw new Error('Failed to set cache');
    }
}

module.exports = { getCache, setCache };
