import map from 'lodash/map'
import find from 'lodash/find'
import filter from 'lodash/filter'
import forEach from "lodash/forEach"
import shuffle from "lodash/shuffle"

import { Client, ClientOptions, GatewayIntentBits } from 'discord.js'
import Promise from 'bluebird'

import prepareEventsForClient from './events'

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0'

export class Bot extends Client {
  isFree: boolean;

  constructor(options: ClientOptions) {
    super(options);
    this.isFree = true;
  }
}

export const clients: Bot[] = []

export const freeClient  = () => find(clients, { isFree: true })
export const freeClients = () => filter(clients, { isFree: true })
export const freeUpClients = () => forEach(clients, (client) => client.isFree = true)

const promises = map([...Array(25)], async (_, index) => {
  const client = new Bot({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMembers
    ]
  })

  try { await client.login(process.env[`BOT_${index + 1}`]) }
  catch (error) { throw new Error(`Error logging in ${index + 1} ${error}`) }

  await prepareEventsForClient(client, index)

  return client
})

Promise.all(promises)

export function shuffleClients() {
  const shuffledClients = shuffle(clients)

  forEach(shuffledClients, (client, index) => clients[index] = client)
}