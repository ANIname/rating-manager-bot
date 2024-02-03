import processJobsQueue from './process-jobs-queue'

import { setTimeout as delay } from 'timers/promises'
import { getUsersRating } from '../../../services/knex/base-queries/user'
import { freeClients, freeClient } from '../../../src/clients'
import { currentRoleData, newRoleData } from './role-data'
import { roles } from '../../../src/roles'
import { queue } from './queue'
import { UserRating } from '../../../services/knex/types'
import updateRoleNameJob from './job/update-role-name'
import updateRoleColorJob from './job/update-role-color'
import removeRoleNotAssignedMembersJob from './job/remove-role-not-assigned-members'
import updateRoleMember from './job/update-role-member'

export default async function prepareJobsQueue() {
  console.time('Prepare jobs for queue')
  
  while (true) {
    if (!roles.length) {
      await delay(1000)

      continue
    }

    if (queue.length) {
      setTimeout(processJobsQueue, 1000)

      break
    }

    if (!freeClients().length) {
      await delay(1000)

      continue
    }

    console.timeLog('Prepare jobs for queue')

    const usersRating = await getUsersRating(100)

    prepareRoleUpdateJobs(usersRating)

    await delay(1000)
  }

  console.timeEnd('Prepare jobs for queue')
}

function prepareRoleUpdateJobs (usersRating: UserRating[]) {
  for (const role of roles) {
    const client = freeClient()

    if (!client) break

    const roleNumber = Number((role.name.split(' ')[3] || '').replace('#', ''))
    const userRating = usersRating[roleNumber - 1]

    const currentRole = currentRoleData(role)
    const newRole     = newRoleData(roleNumber, userRating)

    if (newRole.name !== currentRole.name) updateRoleNameJob(client, currentRole, newRole)
    if (newRole.color !== currentRole.color) updateRoleColorJob(client, currentRole, newRole)
    if (currentRole.members.length > 1) removeRoleNotAssignedMembersJob(client, currentRole, newRole)
    if (newRole.memberId && newRole.memberId !== currentRole.members[0]?.id) updateRoleMember(client, currentRole, newRole)
  }
}
