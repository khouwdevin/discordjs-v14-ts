import { Client, GatewayIntentBits, Collection } from 'discord.js'
import { Command, SlashCommand } from './types'
import { readdirSync } from 'fs'
import { join } from 'path'

const {
  Guilds,
  MessageContent,
  DirectMessages,
  GuildMessages,
  GuildMessageReactions,
  GuildMessageTyping,
  GuildMembers,
  GuildVoiceStates,
  GuildScheduledEvents,
} = GatewayIntentBits

const client = new Client({
  intents: [
    Guilds,
    MessageContent,
    DirectMessages,
    GuildMessages,
    GuildMessageReactions,
    GuildMessageTyping,
    GuildMembers,
    GuildVoiceStates,
    GuildScheduledEvents,
  ],
})

client.slashCommands = new Collection<string, SlashCommand>()
client.commands = new Collection<string, Command>()
client.cooldowns = new Collection<string, number>()
client.timeouts = new Collection<string, NodeJS.Timeout>()

const handlersDir = join(__dirname, './handlers')
readdirSync(handlersDir).forEach((handler) => {
  if (!handler.endsWith('.js')) return
  require(`${handlersDir}/${handler}`)(client)
})

client.login(process.env.TOKEN)
