import { Guild } from 'discord.js'
import { BotEvent } from '../types'
import logger from '../logger'
import GuildModel from '../schemas/Guild'

const event: BotEvent = {
  name: 'guildCreate',
  execute: async (guild: Guild) => {
    const channelid = guild.systemChannel ? guild.systemChannel.id : 'default'

    new GuildModel({
      guildID: guild.id,
      options: {
        detectpresence: false,
        notify: false,
        channel: channelid,
      },
      joinedAt: Date.now(),
    })
      .save()
      .catch((e) =>
        logger.error(`[Event]: Guild failed to create ${e.message}`)
      )
  },
}

export default event
