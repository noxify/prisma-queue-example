import { inspect } from "util"
import type { Options as OraOptions } from "ora"
import { redactionPlugin } from "@loglayer/plugin-redaction"
import { WinstonTransport } from "@loglayer/transport-winston"
import fastRedact from "fast-redact"
import { LogLayer } from "loglayer"
import ora from "ora"
import { serializeError } from "serialize-error"
import { format, transports, createLogger as winstonLogger } from "winston"

import { env } from "./env"

const { combine, errors, timestamp, colorize, splat, printf } = format

const redactPaths = [
  "*.password",
  "*.username",
  "*.secret",
  "*.token",
  "*.key",
  "*.credentials",
  "*.headers.*",
  "*.body",
]
const redactMessages = fastRedact({
  ...{
    paths: redactPaths,
  },
  serialize: false,
})

const devFormat = combine(
  format((info) => {
    info.level = info.level.toUpperCase()
    return info
  })(),
  colorize(),
  timestamp(),
  splat(),
  errors({ stack: true }),
  printf(({ timestamp, level, message, ...rest }) => {
    const stripped = Object.assign({}, Object.fromEntries(Object.entries(rest)))

    const { context, metadata, err } = Object.assign(
      { context: {}, metadata: {}, err: {} },
      stripped,
    )

    let finalError = err
    const coloredContext = inspect(redactMessages(context), {
      depth: 10,
      showHidden: false,
      colors: true,
      compact: true,
    })
    const coloredMetadata = inspect(metadata, {
      depth: 10,
      showHidden: false,
      colors: true,
      compact: true,
    })

    if (
      "code" in err &&
      [
        "ETIMEDOUT",
        "ECONNRESET",
        "EADDRINUSE",
        "ECONNREFUSED",
        "EPIPE",
        "ENOTFOUND",
        "ENETUNREACH",
        "EAI_AGAIN",
      ].includes(err.code as string)
    ) {
      finalError = {
        success: false,
        // @ts-expect-error - this is a valid field, but the type is unknown
        errors: err.message as string,
        statusCode: err.code,
        // @ts-expect-error - this is a valid field, but the type is unknown
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        source: err.options.url,
      }
    }
    const coloredError = inspect(redactMessages(finalError), {
      depth: 10,
      showHidden: false,
      colors: true,
      compact: false,
    })

    const hasContext = coloredContext !== "{}"
    const hasMetadata = coloredMetadata !== "{}"
    const hasError = coloredError !== "{}"

    const contextOutput = hasContext ? "\nContext: " + coloredContext : ""
    const metadataOutput = hasMetadata ? "\nMetadata: " + coloredMetadata : ""
    const errorOutput = hasError ? "\nError: " + coloredError : ""

    return `[${timestamp as string}] ${level} - ${message as string}${contextOutput}${metadataOutput}${errorOutput}`
  }),
)
const w = winstonLogger({
  format: devFormat,
  transports: [new transports.Console()],
  level: env.LOG_LEVEL,
})

export const createLogger = () => {
  const presets = [new WinstonTransport({ logger: w, id: "winston" })]

  return new LogLayer({
    transport: presets,
    plugins: [
      redactionPlugin({
        paths: redactPaths,
      }),
    ],
    errorFieldInMetadata: false,
    metadataFieldName: "metadata",
    contextFieldName: "context",
    errorSerializer: serializeError,
  })
}

export function createSpinner(props?: OraOptions) {
  return ora({
    text: "",
    stream: process.stdout,
    discardStdin: false,
    hideCursor: false,
    ...props,
  })
}
