import dailyQueue from "./daily-queue"
import instantQueue from "./instant-queue"
import otherQueue from "./other-queue"

const queues = {
  dailyQueue,
  instantQueue,
  otherQueue,
}

export type AvailableQueue = keyof typeof queues

export default queues
