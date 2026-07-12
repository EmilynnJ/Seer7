import { createApp } from "./app";
import { env } from "./config";

const app = createApp();

const server = app.listen(env.PORT, () => {
  // eslint-disable-next-line no-console
  console.info(`SoulSeer API listening on port ${env.PORT} [${env.NODE_ENV}]`);
});

function shutdown(signal: string): void {
  // eslint-disable-next-line no-console
  console.info(`Received ${signal}, shutting down gracefully...`);
  server.close(() => {
    process.exit(0);
  });
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
