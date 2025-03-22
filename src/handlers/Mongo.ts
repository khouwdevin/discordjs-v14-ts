import mongoose from 'mongoose'
import { Client } from 'discord.js'
import logger from '../logger'

module.exports = (client: Client) => {
  initalizeMongoDB(client)
}

const initalizeMongoDB = (client: Client) => {
  if (!process.env.MONGO_URI)
    return logger.error('[Handler] : 🍃 Mongo URI not found, skipping')

  mongoose
    .connect(`${process.env.MONGO_URI}@${process.env.MONGO_DATABASE_NAME}`)
    .then(() => {
      logger.info('[Handler] : 🍃 MongoDB connection has been established')
    })
    .catch(() => {
      logger.error('[Handler] : ❌ MongoDB connection has been failed')
      setTimeout(() => {
        logger.info('[Handler] : 🍃 Try reconnecting to MongoDB')
        initalizeMongoDB(client)
      }, 5000)
    })
}
