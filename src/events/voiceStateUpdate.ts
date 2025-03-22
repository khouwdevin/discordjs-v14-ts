import { VoiceState } from 'discord.js'
import { BotEvent } from '../types'
import detectPresence from '../voiceStateFunctions/detectPresence'
import logger from '../logger'

const event: BotEvent = {
  name: 'voiceStateUpdate',
  execute: async (oldstate: VoiceState, newstate: VoiceState) => {
    logger.debug('[Event]: Voice state update')

    if (newstate.channelId !== null) {
      detectPresence(newstate, false)
    } else {
      detectPresence(oldstate, true)
    }
  },
}

export default event
