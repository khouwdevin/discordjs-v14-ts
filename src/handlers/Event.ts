import { Client } from 'discord.js'
import { readdirSync } from 'fs'
import { join } from 'path'
import { BotEvent } from '../types'
import logger from '../logger'

module.exports = (client: Client) => {
  let eventsDir = join(__dirname, '../events')

  readdirSync(eventsDir).forEach((file) => {
    if (!file.endsWith('.js')) return
    let event: BotEvent = require(`${eventsDir}/${file}`).default

    if (event.name === 'raw') return

    event.once
      ? client.once(event.name, (...args) => event.execute(...args))
      : client.on(event.name, (...args) => event.execute(...args))
    logger.info(`[Handler]: 🌠 Successfully loaded event ${event.name}`)
  })

  process.on('unhandledRejection', (error) => {
    logger.error(`[Handler]: ❌ Unhandled promise rejection: ${error}`)
  })
}
