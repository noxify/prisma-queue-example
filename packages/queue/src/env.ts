import { createEnv } from "@t3-oss/env-core"
import { z } from "zod"

export const env = createEnv({
  server: {
    DAILY_QUEUE_ENABLED: z.coerce
      .string()
      .transform((val) => val === "true")
      .default("true"),

    INSTANT_QUEUE_ENABLED: z.coerce
      .string()
      .transform((val) => val === "true")
      .default("true"),

    OTHER_QUEUE_ENABLED: z.coerce
      .string()
      .transform((val) => val === "true")
      .default("false"),
  },
  runtimeEnv: process.env,
  skipValidation:
    !!process.env.CI ||
    process.env.npm_lifecycle_event === "lint" ||
    process.env.npm_lifecycle_event === "test",
})
