# Prisma Queue Example

> The stack originates from [turbo-lucia-starter](https://github.com/noxify/turbo-lucia-starter).

## Quickstart

> The `db` package is configured for `postgres`. If you want to use a different engine, you have to update the configuration and re-generating the migration files.
>
> This repository uses `pnpm` as package manager!

To get it running, follow the steps below:

### 1. Clone the repository

```
git clone git@github.com:noxify/prisma-queue-example.git
```

### 2. Setup dependencies

```
# Install dependencies
pnpm i

# Configure environment variables
# There is an `.env.example` in the root directory you can use for reference
cp .env.example .env

# Generate types
# This generates all needed types based on our prisma schema
pnpm db:generate

# Push the schema to the database
pnpm db:push
# or
# pnpm db:migrate:dev
```

### Start the dev server

You can use the following commands to start the dev mode:

- `pnpm run dev` - Starts the job manager in dev mode
