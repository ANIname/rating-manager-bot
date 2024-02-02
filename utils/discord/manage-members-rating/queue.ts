import { Queue } from './types'

export const queue: Queue = []

export const cleanQueue = () => queue.splice(0, queue.length)
