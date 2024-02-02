import { Role } from 'discord.js'

import declineWord from 'decline-word'
import chromaJs from 'chroma-js'

import { CurrentRoleData, NewRoleData } from './types.d'
import { UserRating } from '../../../services/knex/types'

const gradient = chromaJs.scale(['#86FF99', '#FFD166', '#88C0FC', '#BE9EFF', '#FFB8E0']).domain([100, 80, 50, 20, 1])

export const currentRoleData = (role: Role): CurrentRoleData => ({
  id: role.id,
  name: role.name,
  color: role.color,
  members: role.members.map(member => member)
})

export const newRoleData = (roleNumber: number, userRating?: UserRating): NewRoleData => ({
  name: userRating?.totalPoints
    ? `Top Rated User #${roleNumber} (${userRating.totalPoints} ${declineWord(userRating.totalPoints, 'point', '' , 's', 's')})`
    : `Top Rated User #${roleNumber} (0 points)`,

  color: Number(gradient(roleNumber).num().toFixed(0)),
  memberId: userRating?.discordId
})