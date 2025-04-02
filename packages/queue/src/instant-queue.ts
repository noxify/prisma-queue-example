import { db } from "@acme/db"
import { createLogger } from "@acme/logging"
import { createQueue } from "@mgcrea/prisma-queue"

import { syncDummyDetails } from "./definitions/dummy"
import { env } from "./env"

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
type JobPayload = {
  id: string
}

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
type JobResult = {
  status: number
}

const logger = createLogger()

const queueName = "instantQueue"

const queue = createQueue<JobPayload, JobResult>(
  {
    name: queueName,
    maxConcurrency: 5,
    prisma: db,
    maxAttempts: 3,
    alignTimeZone: true,
    deleteOn: "success",
  },
  async (job) => {
    const { id, payload } = job
    const status = 200
    logger.withContext({ queueName, id, payload }).debug(`Processing job`)
    await job.progress(0)

    /**
     * The instant queue is used internally to fetch only a data for a subset of record ( in our case one :D )
     * This is helpful to get the latest information from a remote record without triggering a full update ( which is done via the `daily-queue` )
     */
    await syncDummyDetails({ ids: [payload.id] })

    await job.progress(100)
    logger.withContext({ queueName, id, payload }).debug(`Finished job`)
    return { status }
  },
)

export default {
  queue,
  job: null,
  enabled: env.INSTANT_QUEUE_ENABLED,
}
