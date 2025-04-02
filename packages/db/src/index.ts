import { PrismaClient } from "@prisma/client"

import { env } from "./env"

const createPrismaClient = () =>
  new PrismaClient({
    datasourceUrl: `${env.RDS_ENGINE}://${env.RDS_USERNAME}:${env.RDS_PASSWORD}@${env.RDS_HOST}:${env.RDS_PORT}/${env.RDS_DBNAME}`,
    log:
      env.NODE_ENV === "development" && env.RDS_DEBUG
        ? [
            {
              emit: "event",
              level: "query",
            },
            {
              emit: "stdout",
              level: "error",
            },
            {
              emit: "stdout",
              level: "info",
            },
            {
              emit: "stdout",
              level: "warn",
            },
          ]
        : ["error"],
  })

const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof createPrismaClient> | undefined
}

export const db = globalForPrisma.prisma ?? createPrismaClient()

if (env.NODE_ENV !== "production") globalForPrisma.prisma = db

export * as prismaExport from "@prisma/client"
