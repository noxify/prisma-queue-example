import { createLogger } from "@acme/logging"

const baseLogger = createLogger()

const delay = (t: number) => new Promise((resolve) => setTimeout(resolve, t))

export async function syncDummyDetails(props?: { ids: string[] }) {
  const logger = baseLogger.withPrefix("syncDummyDetails")

  if (props?.ids) {
    logger.withContext({ ids: props.ids }).debug(`Syncing dummy details based on the given ids`)
    // simulate the background processing e.g. running database insert/updates and/or remote api calls
    await delay(2000)
  } else {
    logger.debug(`Syncing dummy details for all records`)
    // simulate the background processing e.g. running database insert/updates and/or remote api calls
    await delay(5000)
  }
}
