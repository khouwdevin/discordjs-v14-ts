import logger from '../logger'
import { EmbedBuilder, Message } from 'discord.js'

const loggerLevel = (message: Message, args: string[]) => {
  try {
    logger.debug('[Logger Command]: Run logger command.')

    const loggerLevel = args[1]
    const userId = message.author.id

    if (userId !== process.env.USER_ID) {
      logger.trace('[Logger Command]: User is not authorized')

      return
    }
    if (
      loggerLevel !== 'info' &&
      loggerLevel !== 'trace' &&
      loggerLevel !== 'debug'
    ) {
      logger.trace('[Logger Command]: Logger level is not valid')

      return
    }

    logger.level = loggerLevel

    const author = message.author
    const client = message.client

    const embed = new EmbedBuilder()
      .setAuthor({
        name: 'Player Updated',
        iconURL: client.user.avatarURL() || undefined,
      })
      .setFields({
        name: ' ',
        value: `Logger level is changed to ${loggerLevel}`,
      })
      .setFooter({ text: 'STALKER MUSIC' })
      .setColor('Purple')

    author.send({ embeds: [embed] })
  } catch (e) {
    logger.error(
      `[Logger Command]: ❌ Failed to configure logger: ${e.message}`
    )
  }
}

export default loggerLevel
