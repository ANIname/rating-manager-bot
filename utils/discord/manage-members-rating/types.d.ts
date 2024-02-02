import { GuildMember, Snowflake } from 'discord.js'

export type Queue = Job[]

export interface Job {
  name: string
  execute: Function
}

export interface CurrentRoleData {
  id: Snowflake
  name: string
  color: number
  members: GuildMember[]
}

export interface NewRoleData {
  name: string
  color: number
  memberId?: Snowflake
}
