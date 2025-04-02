import { db } from "@acme/db"
import { createLogger } from "@acme/logging"
import { createQueue } from "@mgcrea/prisma-queue"
import { CronExpressionBuilder } from "natural-cron"

import { env } from "./env"

type JobPayload = object

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
type JobResult = {
  status: number
}

const logger = createLogger()

const queueName = "otherQueue"

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
    const { id } = job
    const status = 200

    logger.withContext({ queueName, id }).debug(`Processing job`)
    await job.progress(0)

    /**
     * Run here your custom script to fufill the daily queue stuff
     * e.g. running a full update based on an ID from a remote system
     */

    logger.withContext({ queueName, id }).debug(`Finished job`)

    await job.progress(100)

    return { status }
  },
)

async function job() {
  const schedule = new CronExpressionBuilder()

  const hasJob = (await queue.size()) > 0

  if (!hasJob) {
    logger
      .withContext({
        queueName,
      })
      .info(`There is no job in the queue. Create a new one`)
    await queue.schedule({ cron: schedule.atTime("01:00").compile(), key: "otherQueueSync" }, {})
  } else {
    logger
      .withContext({
        queueName,
      })
      .info(`There is a job in the queue. Skipping`)
  }
}

export default {
  queue,
  job,
  enabled: env.OTHER_QUEUE_ENABLED,
}
