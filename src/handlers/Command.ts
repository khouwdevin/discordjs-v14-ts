import {
  Client,
  Routes,
  REST,
  SlashCommandOptionsOnlyBuilder,
} from 'discord.js'
import { readdirSync } from 'fs'
import { join } from 'path'
import { Command, SlashCommand } from '../types'
import logger from '../logger'

module.exports = (client: Client) => {
  const slashCommands: SlashCommandOptionsOnlyBuilder[] = []
  const commands: Command[] = []

  let slashCommandsDir = join(__dirname, '../slashCommands')
  let commandsDir = join(__dirname, '../commands')

  readdirSync(slashCommandsDir).forEach((file) => {
    if (!file.endsWith('.js')) return
    let command: SlashCommand = require(`${slashCommandsDir}/${file}`).default
    slashCommands.push(command.command)
    client.slashCommands.set(command.command.name, command)
  })

  readdirSync(commandsDir).forEach((file) => {
    if (!file.endsWith('.js')) return
    let command: Command = require(`${commandsDir}/${file}`).default
    commands.push(command)
    client.commands.set(command.name, command)
  })

  const rest = new REST().setToken(process.env.TOKEN)

  rest
    .put(Routes.applicationCommands(process.env.CLIENT_ID), {
      body: slashCommands.map((command) => command.toJSON()),
    })
    .then((data: any) => {
      logger.info(
        `[Handler]: 🔥 Successfully loaded ${data.length} slash command(s)`
      )
    })
    .catch((e) => {
      logger.error(`[Handler]: ❌ Failed to rest.put : ${e.message}`)
    })
}
