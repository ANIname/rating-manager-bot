import { queue, cleanQueue } from "./queue"
import { freeUpClients, shuffleClients } from "../../../src/clients"
import { updateRoles } from "../../../src/roles"

import prepareJobsQueue from "./prepare-jobs-queue"

export default async function processJobsQueue() {
  while (true) {
    console.time('Process jobs from queue')

    console.timeLog('Process jobs from queue', 'Queue:', queue.map((job) => job.name))

    await Promise.all(queue.map((job) => job.execute()))

    cleanQueue()
    freeUpClients()
    shuffleClients()

    updateRoles()

    console.timeEnd('Process jobs from queue')

    setTimeout(prepareJobsQueue, 1)

    break
  }
}