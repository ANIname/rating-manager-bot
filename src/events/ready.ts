import { ClientUser, Guild } from 'discord.js'

import { Bot, clients } from '../clients'
import { PromiseResolve } from '../types.d'

import { roles } from '../roles'

let readyBotsCounter = 0

/**
 * Emitted when the client becomes ready to start working
 * @param {Bot} Bot - Discord Client
 */
export default async function ready (client: Bot, index: number, resolve: PromiseResolve) {
  const bot = client.user as ClientUser

  if (index === 0) {
    const guild = client.guilds.cache.first() as Guild

    // !Important - We should cache all guild members to use them in the future
    const guildMembers = await guild.members.fetch()

    const topRatedUserRoles = (await guild.roles.fetch())
      .filter((role) => role.name.startsWith('Top Rated User #'))
      .map((role) => role)

    roles.push(...topRatedUserRoles)

    console.log(`${bot.username} #${bot.discriminator} rating manager #${index + 1} (${++readyBotsCounter}) bot is ready! Cached members: ${guildMembers.size}`)
  }

  else {
    console.log(`${bot.username} #${bot.discriminator} rating manager #${index + 1} (${++readyBotsCounter}) bot is ready!`)
  }

  clients.push(client)

  resolve()
}
