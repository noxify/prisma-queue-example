/**
 * Sources:
 *   * https://github.com/prisma/prisma/issues/6980#issuecomment-1667012900
 *   * https://github.com/prisma/prisma/issues/6980#issuecomment-1605250072
 *   * https://github.com/prisma/prisma/issues/6980#issuecomment-2049264510
 */

import type { Prisma, PrismaClient } from "@prisma/client"
import PrismaRuntime from "@prisma/client/runtime/library"

import PrismaTypes = PrismaRuntime.Types

export type { PrismaTypes }
export { Prisma, PrismaClient } from "@prisma/client"
export * as PrismaRuntime from "@prisma/client/runtime/library"

export type ModelName = Prisma.ModelName
export type PrismaModelName = ModelName

export const getPrismaModelProp = <N extends PrismaModelName>(name: N) =>
  `${name.charAt(0).toLowerCase()}${name.slice(1)}` as PrismaModelProp<N>

export const getPrismaDelegate = <N extends PrismaModelName>(
  name: N,
  prisma: PrismaClient,
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-explicit-any
) => prisma[getPrismaModelProp(name)] as PrismaModelDelegate<N> as any // For generic model delegate

// Use `PrismaModel` for any available Prisma model (e.g. as a method parameter or generic type parameter)
// Use `PrismaModel<"YourModelName">` for specific Prisma model
export type PrismaModel<N extends ModelName = ModelName> = PrismaTypes.Result.DefaultSelection<
  PrismaModelPayload<N>
>
export type PrismaModelProp<N extends ModelName = ModelName> = Uncapitalize<N>
export type PrismaModelType<N extends ModelName = ModelName> = Prisma.TypeMap["model"][N]
export type PrismaModelPayload<N extends ModelName = ModelName> = PrismaModelType<N>["payload"]
export type PrismaModelDelegate<N extends ModelName = ModelName> = PrismaClient[PrismaModelProp<N>]

export type PrismaModels = { [N in Prisma.ModelName]: PrismaModel<N> }
export type PrismaModelProps = { [N in Prisma.ModelName]: PrismaModelProp<N> }
export type PrismaModelTypes = { [N in Prisma.ModelName]: PrismaModelType<N> }
export type PrismaModelPayloads = {
  [N in Prisma.ModelName]: PrismaModelPayload<N>
}
export type PrismaModelDelegates = {
  [N in Prisma.ModelName]: PrismaModelDelegate<N>
}

export type FindManyArgs<N extends ModelName> = PrismaModelType<N>["operations"]["findMany"]["args"]
export type FindUniqueArgs<N extends ModelName> =
  PrismaModelType<N>["operations"]["findUnique"]["args"]
export type WhereInput<N extends ModelName = ModelName> = NonNullable<FindManyArgs<N>["where"]>
export type WhereAnd<N extends ModelName = ModelName> = NonNullable<WhereInput<N>["AND"]>
export type WhereOr<N extends ModelName = ModelName> = NonNullable<WhereInput<N>["OR"]>
export type WhereUniqueInput<N extends ModelName = ModelName> = NonNullable<
  FindUniqueArgs<N>["where"]
>
export type PrismaFieldOperator =
  | "contains"
  | "endsWith"
  | "startsWith"
  | "equals"
  | "gt"
  | "gte"
  | "in"
  | "lt"
  | "lte"
  | "not"
  | "notIn"
  | "isEmpty"
  | null
