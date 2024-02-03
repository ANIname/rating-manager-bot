import { Role } from 'discord.js'
import { freeClient } from './clients'

import forEach from "lodash/forEach"

export const roles: Role[] = []

export function updateRoles () {
  const client = freeClient()

  if (!client) throw new Error('No free clients')

  const guild = client.guilds.cache.first()
  const cachedRoles = guild?.roles.cache

  forEach(roles, (role, index) => {
    const cachedRole = cachedRoles?.get(role.id)

    if (cachedRole) roles[index] = cachedRole
  })
}
