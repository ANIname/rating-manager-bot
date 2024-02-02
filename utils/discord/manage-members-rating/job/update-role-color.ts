import { Role } from 'discord.js'

import { Bot } from '../../../../src/clients'

import { queue } from '../queue'

import { CurrentRoleData, NewRoleData } from '../types'


export default function updateRoleColorJob (client: Bot, currentRole: CurrentRoleData, newRole: NewRoleData) {
  client.isFree = false

  const jobName  = `change-color-from-${currentRole.id}-to-${newRole.color}`
  const jobIndex = queue.findIndex((job) => job.name === jobName)

  if (jobIndex !== -1) return

  queue.push({
    name: jobName,
    execute: updateRoleColor.bind(null, client, currentRole.id, newRole.color)
  })
}

async function updateRoleColor (client: Bot, roleId: string, roleColor: number) {
  const role = await client.guilds.cache.first()?.roles.fetch(roleId) as Role

  await role.setColor(roleColor)

  return role
}