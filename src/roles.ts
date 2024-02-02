import { Role } from 'discord.js'

import forEach from "lodash/forEach"

export const roles: Role[] = []

export const updateRoles = (updatedRoles: Role[]) => forEach(updatedRoles, (role, index) => roles[index] = role)
