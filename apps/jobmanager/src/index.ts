import type { AvailableQueue } from "@acme/queue"
import { createLogger } from "@acme/logging"
import queues from "@acme/queue"
import yargs from "yargs"
import { hideBin } from "yargs/helpers"

const logger = createLogger()

const args = yargs(hideBin(process.argv))
  .choices("queue", Object.keys(queues))
  .boolean("force")
  .parseSync()

const startQueue = async (queue: AvailableQueue = "otherQueue", force = false) => {
  if (!queues[queue].enabled && !force) {
    logger.info(`Queue ${queue} is disabled - stopping existing queues`)
    await queues[queue].queue.stop()
  } else {
    logger.info(`Starting queue ${queue} ( enabled: ${queues[queue].enabled} / force: ${force})`)
    if (queues[queue].job) {
      await queues[queue].job()
    }
    await queues[queue].queue.start()
  }
}

void startQueue(args.queue as AvailableQueue, args.force)
