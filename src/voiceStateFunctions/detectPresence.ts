import { TextChannel, VoiceState } from 'discord.js'
import { sendMessage } from '../functions'
import logger from '../logger'

const detectPresence = async (voiceState: VoiceState, isLeft: boolean) => {
  try {
    if (!voiceState.member || !voiceState.guild) return
    if (voiceState.client.user === voiceState.member.user) return

    const channel = voiceState.guild.systemChannel

    if (isLeft)
      sendMessage(
        `${voiceState.member.user} left ${voiceState.channel} channel!`,
        channel as TextChannel
      )
    else
      sendMessage(
        `${voiceState.member.user} joined ${voiceState.channel} channel!`,
        channel as TextChannel
      )
  } catch (e) {
    logger.error(
      `[Detect Presence]: ❌ Failed to detect presence : ${e.message}`
    )
  }
}

export default detectPresence
