import { createServer } from "node:http";
import app from "./app";
import { createServer } from "http";
import { logger } from "./lib/logger";
import { setupWebSocketServer, startKafkaLeaderboardForwarder } from "./lib/websocket";

const rawPort = process.env["PORT"];

if (!rawPort) {
  throw new Error(
    "PORT environment variable is required but was not provided.",
  );
}

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

const server = createServer(app);
setupWebSocketServer(server);
startKafkaLeaderboardForwarder().catch((err: unknown) => {
  logger.warn({ err }, "Kafka leaderboard websocket forwarder did not start");
});

server.listen(port, () => {
  logger.info({ port }, "Server listening");
});
