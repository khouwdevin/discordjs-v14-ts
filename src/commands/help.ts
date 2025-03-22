import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
} from 'discord.js'
import { Command } from '../types'
import logger from '../logger'

const command: Command = {
  name: 'help',
  execute: async (message, args) => {
    try {
      logger.debug('[Help Command]: Run help command')

      if (!message.channel.isSendable()) {
        logger.error(
          '[Play Command]: Cannnot send message because channel is not sendable'
        )
        return
      }

      const embed = new EmbedBuilder()
        .setTitle(commandText[0].title)
        .setColor('Orange')
        .setFields(commandText[0].field)
        .setFooter(commandText[0].footer)

      const currentMessage = await message.channel.send({ embeds: [embed] })

      const backButton = new ButtonBuilder()
        .setLabel('⬅️')
        .setStyle(ButtonStyle.Primary)
        .setCustomId(`help.${currentMessage.id}.back`)

      const nextButton = new ButtonBuilder()
        .setLabel('➡️')
        .setStyle(ButtonStyle.Primary)
        .setCustomId(`help.${currentMessage.id}.next`)

      const buttonsRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
        backButton,
        nextButton
      )

      await currentMessage.edit({ embeds: [embed], components: [buttonsRow] })

      const timeout = setTimeout(async () => {
        await currentMessage
          .delete()
          .catch((e) =>
            logger.error(
              `[Help Command]: ❌ Failed to delete message : ${e.message}`
            )
          )
      }, 20000)

      const client = message.client
      client.timeouts.set(`help-${currentMessage.id}`, timeout)
      logger.trace(`[Help Command]: Current timeout help-${currentMessage.id}`)
    } catch (e) {
      logger.error(`[Help Command]: ❌ Failed to show help : ${e.message}`)
    }
  },
  button: async (interaction) => {
    try {
      if (!interaction.channel) return

      const [type, messageId, command] = interaction.customId.split('.')
      const client = interaction.client
      const currentMessage = await interaction.channel.messages
        .fetch(messageId)
        .catch((e) =>
          logger.error(
            `[Help Command Button]: ❌ Failed to fetch message : ${e.message}`
          )
        )

      if (!currentMessage) return
      if (!currentMessage.embeds[0].footer) return

      const components = currentMessage.components[0]
      const currentPage =
        parseInt(currentMessage.embeds[0].footer.text.split('/')[0]) - 1
      const index = command === 'next' ? 1 : -1
      const nextPage = Math.max(0, Math.min(currentPage + index, 3))

      const embed = new EmbedBuilder()
        .setTitle(commandText[nextPage].title)
        .setColor('Orange')
        .setFields(commandText[nextPage].field)
        .setFooter(commandText[nextPage].footer)

      currentMessage.edit({ embeds: [embed], components: [components] })

      clearTimeout(client.timeouts.get(`help-${messageId}`))
      client.timeouts.delete(`help-${messageId}`)

      const timeout = setTimeout(async () => {
        await currentMessage
          .delete()
          .catch((e) =>
            logger.error(
              `[Help Command Button]: ❌ Failed to delete message : ${e.message}`
            )
          )
      }, 20000)

      client.timeouts.set(`help-${currentMessage.id}`, timeout)

      interaction.deferUpdate()
    } catch (e) {
      logger.error(
        `[Help Command Button]: ❌ Failed to process interact button help : ${e.message}`
      )
    }
  },
  cooldown: 2,
  aliases: ['h'],
  permissions: [],
}

const commandText = [
  {
    title: 'Command List',
    field: [
      {
        name: `${process.env.PREFIX_COMMAND}greet`,
        value: `
                    Stalker will greet you!\r
                    example => **${process.env.PREFIX_COMMAND}greet** or **${process.env.PREFIX_COMMAND}g**\r
                    `,
      },
    ],
    footer: { text: '1/2' },
  },
  {
    title: 'Slash Command List',
    field: [
      {
        name: ' ',
        value: `
                    **/ping**: to test bot ping\r
                    `,
      },
    ],
    footer: { text: '2/2' },
  },
]

export default command
