import logger from '../logger'
import { Command } from '../types'

const command: Command = {
  name: 'greet',
  execute: (message, args) => {
    try {
      if (!message.channel.isSendable()) {
        logger.error(
          '[Play Command]: Cannnot send message because channel is not sendable'
        )
        return
      }

      const toGreet = message.mentions.members?.first()
      message.channel.send(
        `Hello there ${toGreet ? toGreet.user : message.member?.user}!`
      )
    } catch {}
  },
  aliases: ['g'],
  permissions: [], // to test
}

export default command
