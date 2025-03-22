import {
  Guild,
  GuildMember,
  PermissionFlagsBits,
  PermissionResolvable,
  TextChannel,
} from 'discord.js'
import GuildDB from './schemas/Guild'
import { GuildOption } from './types'
import mongoose from 'mongoose'
import GuildModel from './schemas/Guild'
import logger from './logger'

const addNewGuild = async (guildId: string, channelId: string) => {
  const newGuild = new GuildModel({
    guildID: guildId,
    options: {
      defaultChannel: channelId,
    },
    joinedAt: Date.now(),
  })
  await newGuild.save()
  return newGuild
}

export const checkPermissions = (
  member: GuildMember,
  permissions: Array<PermissionResolvable>
) => {
  let neededPermissions: PermissionResolvable[] = []
  permissions.forEach((permission) => {
    if (!member.permissions.has(permission)) neededPermissions.push(permission)
  })
  if (neededPermissions.length === 0) return null
  return neededPermissions.map((p) => {
    if (typeof p === 'string') return p.split(/(?=[A-Z])/).join(' ')
    else
      return Object.keys(PermissionFlagsBits)
        .find((k) => Object(PermissionFlagsBits)[k] === p)
        ?.split(/(?=[A-Z])/)
        .join(' ')
  })
}

export const sendTimedMessage = (
  message: string,
  channel: TextChannel,
  duration: number
) => {
  channel
    .send(message)
    .then((m) =>
      setTimeout(
        async () =>
          (await channel.messages.fetch(m))
            .delete()
            .catch((e) =>
              logger.error(
                `[Send Timed Message]: ❌ Failed to delete message : ${e.message}`
              )
            ),
        duration
      )
    )
  return
}

export const sendMessage = (message: string, channel: TextChannel) => {
  channel
    .send(message)
    .catch((e) =>
      logger.error(`[Send Message]: ❌ Failed to delete message : ${e.message}`)
    )
}

export const getGuildOption = async (guild: Guild, option: GuildOption) => {
  if (mongoose.connection.readyState === 0)
    return logger.error('[Get Guild Option]: ❌ Database is not connected')
  let foundGuild = await GuildDB.findOne({ guildID: guild.id })
  if (!foundGuild) {
    const newGuild = await addNewGuild(guild.id, guild.systemChannel?.id ?? '')
    return newGuild.options[option]
  }
  return foundGuild.options[option]
}

export const getAllGuildOption = async (guild: Guild) => {
  if (mongoose.connection.readyState === 0)
    return logger.error('[Get All Guild Option]: ❌ Database is not connected')
  let foundGuild = await GuildDB.findOne({ guildID: guild.id })
  if (!foundGuild) {
    const newGuild = await addNewGuild(guild.id, guild.systemChannel?.id ?? '')
    return newGuild.options
  }
  return foundGuild.options
}

export const setGuildOption = async (
  guild: Guild,
  option: GuildOption,
  value: any
) => {
  if (mongoose.connection.readyState === 0)
    return logger.error('[Set Guild Option]: ❌ Database is not connected')
  let foundGuild = await GuildDB.findOne({ guildID: guild.id })
  if (!foundGuild) {
    const newGuild = await addNewGuild(guild.id, guild.systemChannel?.id ?? '')
    newGuild.options[option] = value
    await newGuild.save()
    return
  }
  foundGuild.options[option] = value
  await foundGuild.save()
}

export const getAllGuild = async () => {
  if (mongoose.connection.readyState === 0)
    return logger.error('[Get All Guild]: ❌ Database is not connected')
  const guilds = await GuildDB.find()
  return guilds
}
