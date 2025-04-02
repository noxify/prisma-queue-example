module.exports = {
  apps: [
    {
      name: "instant-queue",
      script: "./src/index.ts",
      args: "--queue instantQueue",
      interpreter: "node",
      interpreter_args: "--import tsx/esm",
    },
    {
      name: "daily-queue",
      script: "./src/index.ts",
      args: "--queue dailyQueue",
      interpreter: "node",
      interpreter_args: "--import tsx/esm",
    },
    {
      name: "other-queue",
      script: "./src/index.ts",
      args: "--queue otherQueue",
      interpreter: "node",
      interpreter_args: "--import tsx/esm",
    },
  ],
}
