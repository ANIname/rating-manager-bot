import { ClientEvents } from 'discord.js'

import { directoryImport } from 'directory-import'

import camelCase from 'lodash/camelCase.js'

import { Event, EventData } from './types.d'
import { Bot } from '../clients'

export default (client: Bot, index: number) => new Promise((resolve) => {
  directoryImport((moduleName, _, moduleData) => {
    const eventName = camelCase(moduleName) as keyof ClientEvents
    const listener  = (moduleData as EventData).default as Event

    if (typeof listener !== 'function') return

    client.on(eventName, (...arguments_) => listener(...arguments_, index, resolve))
  })
})