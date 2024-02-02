import { Snowflake } from 'discord.js'

export interface UserRating {
  discordId: Snowflake
  totalPoints: number
}