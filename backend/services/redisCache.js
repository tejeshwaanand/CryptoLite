const Redis = require('ioredis');
require('dotenv').config();

const redis = new Redis({
    // host: 'redis-14829.c61.us-east-1-3.ec2.redns.redis-cloud.com',
    host: 'redis-16229.c244.us-east-1-2.ec2.cloud.redislabs.com',
    port: 16229,
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
