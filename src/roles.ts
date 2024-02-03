import { Role, Guild } from 'discord.js'
import { freeClient } from './clients'

import forEach from "lodash/forEach"

export const roles: Role[] = []

export async function updateRoles () {
  const client = freeClient()

  if (!client) throw new Error('No free clients')

  const guild = client.guilds.cache.first() as Guild

  // !Important - We should cache all guild members to use them in the future
  const guildMembers = await guild.members.fetch()

  const topRatedUserRoles = (await guild.roles.fetch())
    .filter((role) => role.name.startsWith('Top Rated User #'))

  forEach(roles, (role, index) => {
    const cachedRole = topRatedUserRoles?.get(role.id)

    if (cachedRole) roles[index] = cachedRole
  })

  console.log('Roles updated. Cached members:', guildMembers.size)
}
