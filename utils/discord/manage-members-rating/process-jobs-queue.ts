import { queue, cleanQueue } from "./queue"
import { freeUpClients, shuffleClients } from "../../../src/clients"
import { updateRoles } from "../../../src/roles"

import prepareJobsQueue from "./prepare-jobs-queue"

export default async function processJobsQueue() {
  while (true) {
    console.log('loop', 2)

    const updatedRoles = await Promise.all(queue.map((job) => job.execute()))

    cleanQueue()
    freeUpClients()
    shuffleClients()
    updateRoles(updatedRoles)

    setTimeout(prepareJobsQueue, 1)

    break
  }
}