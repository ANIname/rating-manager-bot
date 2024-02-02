import { GuildMember, Role, Snowflake } from 'discord.js'

import { Bot } from '../../../../src/clients'

import { queue } from '../queue'
import knex from '../../../../services/knex'

import { CurrentRoleData, NewRoleData } from '../types'


export default function updateRoleMemberJob(client: Bot, currentRole: CurrentRoleData, newRole: NewRoleData) {
  client.isFree = false

  const jobName  = `update-role-member-${currentRole.id}`
  const jobIndex = queue.findIndex((job) => job.name === jobName)

  if (jobIndex !== -1) return

  queue.push({
    name: jobName,
    execute: updateRoleMember.bind(null, client, currentRole, newRole.memberId as Snowflake)
  })
}

async function updateRoleMember(client: Bot, currentRole: CurrentRoleData, newMemberId: Snowflake) {
  const role = await client.guilds.cache.first()?.roles.fetch(currentRole.id) as Role
  
  const oldMember = role.members.first()
  let newMember: GuildMember | undefined

  try {
    newMember = await role.guild.members.fetch(newMemberId)
  } catch (error) {
    // @ts-expect-error
    if (error.code === 10007) {
      console.warn('User was remooved from guild!', newMemberId)

      await knex('User').where({ discordId: newMemberId }).update({ discordId: null })
    } else {
      console.log('Error updating role member', newMemberId)

      throw error
    }
  }

  const promises = []

  if (oldMember) promises.push(oldMember.roles.remove(role))
  if (newMember) promises.push(newMember.roles.add(role))

  await Promise.all(promises)

  return role
}

