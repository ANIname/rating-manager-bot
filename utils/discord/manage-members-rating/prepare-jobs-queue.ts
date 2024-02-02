import processJobsQueue from './process-jobs-queue'

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
  while (true) {
    console.log('loop', 1)

    if (!roles.length) {
      setTimeout(prepareJobsQueue, 1000)

      break
    }

    if (queue.length) {
      setTimeout(processJobsQueue, 1000)

      break
    }

    if (!freeClients().length) {
      setTimeout(prepareJobsQueue, 1000)

      break
    }

    const usersRating = await getUsersRating(100)

    prepareRoleUpdateJobs(usersRating)

    setTimeout(prepareJobsQueue, 1000)

    break
  }
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
