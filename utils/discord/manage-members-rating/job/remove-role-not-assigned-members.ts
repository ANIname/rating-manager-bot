import filter from 'lodash/filter'
import map from 'lodash/map'

import { Role, Snowflake } from 'discord.js'

import { Bot } from '../../../../src/clients'

import { queue } from '../queue'

import { CurrentRoleData, NewRoleData } from '../types'


export default function removeRoleNotAssignedMembers(client: Bot, currentRole: CurrentRoleData, newRole: NewRoleData) {
  client.isFree = false

  const jobName  = `remove-role-not-assigned-members-${currentRole.id}`
  const jobIndex = queue.findIndex((job) => job.name === jobName)

  if (jobIndex !== -1) return

  queue.push({
    name: jobName,
    execute: deleteRoleUnusedMembers.bind(null, client, currentRole, newRole.memberId)
  })
}

async function deleteRoleUnusedMembers(client: Bot, currentRole: CurrentRoleData, memberId: Snowflake | undefined) {
  const role = await client.guilds.cache.first()?.roles.fetch(currentRole.id) as Role
  const membersToDelete = filter(currentRole.members, (member) => member.id !== memberId)

  const promises = map(membersToDelete, (member) => member.roles.remove(role))

  await Promise.all(promises)

  return role
}