import { Guild, Role, Snowflake } from 'discord.js'

export interface UpdateRoleData {
  id: Snowflake;
  name: string;
  color: number;
  member?: Snowflake;
}

export type PromiseResolve = (thenableOrResult?: unknown) => void