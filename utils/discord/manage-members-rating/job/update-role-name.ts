import { Role } from 'discord.js'

import { Bot } from '../../../../src/clients'

import { queue } from '../queue'

import { CurrentRoleData, NewRoleData } from '../types'

export default function updateRoleNameJob (client: Bot, currentRole: CurrentRoleData, newRole: NewRoleData) {
  client.isFree = false

  const jobName  = `change-name-from-${currentRole.id}-to-${newRole.name}`
  const jobIndex = queue.findIndex((job) => job.name === jobName)

  if (jobIndex !== -1) return

  queue.push({
    name: jobName,
    execute: updateRoleName.bind(null, client, currentRole.id, newRole.name)
  })
}

async function updateRoleName (client: Bot, roleId: string, roleName: string) {
  const role = await client.guilds.cache.first()?.roles.fetch(roleId) as Role

  await role.setName(roleName)

  return role
}