import { pascal as pascalCase } from 'case'
import { Snowflake } from 'discord.js'
import forEach from 'lodash/forEach'
import map from 'lodash/map'
import reduce from 'lodash/reduce'

import knex from '..'
import { availableGames } from '../enum'
import { UserRating } from '../types.d'

/**
 * Get the users rating
 * @param {number} limit - Limit of users
 * @returns {Promise<UserRating[]>} - Users rating
 */
export async function getUsersRating (limit = 10): Promise<UserRating[]> {
  const usersQuery = knex('User')
    .leftJoin('Game', 'User.id', 'Game.userId')
    .select('User.discordId')
    .groupBy('User.discordId')
    .where('User.isBot', false)
    .whereNotNull('User.discordId')

  const havingRawParts:  string[] = []
  const orderByRawParts: string[] = []

  forEach(availableGames, (gameTitle) => {
    const gameName = pascalCase(`Game-${gameTitle}`)

    // Add each game points to the query
    usersQuery
      .leftJoin(gameName, 'Game.id', `${gameName}.gameId`)
      .sum(`${gameName}.points as ${gameTitle}Points`)

    // Add each game points to the having query parts
    havingRawParts.push(`COALESCE(sum("${gameName}"."points"), 0)`);

    // Add each game points to the order by query parts
    orderByRawParts.push(`COALESCE(sum("${gameName}"."points"), 0)`)
  })

  // Combine all parts for having and order by queries
  const havingRawQuery  = havingRawParts.join(' + ') + ' > 0';
  const orderByRawQuery = orderByRawParts.join(' + ') + ' DESC'

  const users = await usersQuery
    .having(knex.raw(havingRawQuery))
    .orderByRaw(orderByRawQuery)
    .limit(limit)

  return map(users, ({ discordId, ...pointsPerGames }) => ({
    discordId: discordId as Snowflake,
    totalPoints: reduce(pointsPerGames, (accumulator, points) => accumulator + Number(points) || 0, 0)
  }))
}
