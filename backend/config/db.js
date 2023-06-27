const mongoose = require("mongoose")
require("dotenv").config()
const connection = mongoose.connect(process.env.mongoURL)
const ioredis = require("ioredis")

const redisClient = new ioredis({
    host: process.env.redis_host,
    password: process.env.redis_pass,
    port: process.env.redis_port
})

module.exports = {
    connection, redisClient
}