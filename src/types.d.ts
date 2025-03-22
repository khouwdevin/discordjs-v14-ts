import {
  CommandInteraction,
  Collection,
  PermissionResolvable,
  Message,
  AutocompleteInteraction,
  ChatInputCommandInteraction,
  ButtonInteraction,
  ModalSubmitInteraction,
  APIEmbedField,
  EmbedFooterOptions,
  SlashCommandOptionsOnlyBuilder,
} from 'discord.js'
import { Player, MoonlinkEvents, Manager, TPlayerLoop } from 'moonlink.js'
import mongoose from 'mongoose'
import { Logger } from 'pino'

export interface SlashCommand {
  command: SlashCommandOptionsOnlyBuilder
  execute: (interaction: ChatInputCommandInteraction) => void
  modal?: (interaction: ModalSubmitInteraction) => void
  button?: (interaction: ButtonInteraction) => void
  autocomplete?: (interaction: AutocompleteInteraction) => void
  cooldown?: number // in seconds
}

export interface Command {
  name: string
  execute: (message: Message, args: Array<string>) => void
  button?: (interaction: ButtonInteraction) => void
  permissions: Array<PermissionResolvable>
  aliases: Array<string>
  cooldown?: number
}

interface GuildOptions {
  defaultChannel: String
}

export interface IGuild extends mongoose.Document {
  guildID: string
  options: GuildOptions
  joinedAt: Date
}

export type GuildOption = keyof GuildOptions

export interface BotEvent {
  name: string
  once?: boolean | false
  execute: (...args) => void
}

export interface MoonEvent {
  name: keyof MoonlinkEvents
  execute: (...args) => void
}

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      TOKEN: string
      CLIENT_ID: string
      MY_ID: string
      PREFIX_COMMAND: string
      MONGO_URI: string
      MONGO_DATABASE_NAME: string
      BOT_DATABASE: string
      USER_ID: string
    }
  }
}

declare module 'discord.js' {
  export interface Client {
    slashCommands: Collection<string, SlashCommand>
    commands: Collection<string, Command>
    cooldowns: Collection<string, number>
    timeouts: Collection<string, NodeJS.Timeout>
  }
}
