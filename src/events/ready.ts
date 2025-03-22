import { ActivityType, Client } from 'discord.js'
import { BotEvent } from '../types'
import logger from '../logger'

const event: BotEvent = {
  name: 'ready',
  once: true,
  execute: async (client: Client) => {
    logger.debug('[Event]: Client is ready')

    if (!client.user) return

    client.user.setPresence({
      status: 'online',
      activities: [
        {
          name: `${process.env.PREFIX_COMMAND}help`,
          type: ActivityType.Listening,
        },
      ],
    })

    client.users
      .fetch(process.env.USER_ID)
      .then(async (user) => {
        await user
          .createDM()
          .catch((e) =>
            logger.error(`[Create DM]: ❌ Create DM is failed ${e.message}`)
          )
        logger.info("[Create DM]: 💪 Owner's DM is created")
      })
      .catch((e) => logger.error(`[Get User]: ❌ Get user failed ${e.message}`))
  },
}

export default event
