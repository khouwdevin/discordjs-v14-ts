import { Guild } from 'discord.js'
import GuildModel from '../schemas/Guild'
import { BotEvent } from '../types'
import logger from '../logger'

const event: BotEvent = {
  name: 'guildDelete',
  execute: (guild: Guild) => {
    logger.info('[Event]: Guild is deleted')

    GuildModel.deleteOne({ guildID: guild.id }).catch((e) =>
      logger.error(`[Event]: ❌ Failed to delete guild doc : ${e.message}`)
    )
  },
}

export default event
