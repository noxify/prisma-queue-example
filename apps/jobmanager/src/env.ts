/* eslint-disable no-restricted-properties */
import { env as dbEnv } from "@acme/db/env"
import { env as queueEnv } from "@acme/queue/env"
import { createEnv } from "@t3-oss/env-core"
import { z } from "zod"

export const env = createEnv({
  extends: [dbEnv, queueEnv],

  server: {
    NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
    MAIL_TO_LOG: z.coerce
      .string()
      .transform((val) => val === "true")
      .default("false"),
  },

  runtimeEnv: process.env,
  skipValidation: !!process.env.CI || process.env.npm_lifecycle_event === "lint",
})
