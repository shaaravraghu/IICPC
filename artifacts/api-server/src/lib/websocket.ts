import type { Server as HttpServer } from "node:http";
import { Kafka } from "kafkajs";
import { Server } from "socket.io";
import { logger } from "./logger";

let io: Server | null = null;

export type PipelineProgressPayload = {
  testRunId: string;
  submissionId?: string | null;
  status: string;
  currentLayer: string;
  progressPct: number;
  assetsTotal?: number;
  assetsAnalyzed?: number;
  technicalPassCount?: number;
  fundamentalPassCount?: number;
  sentimentPassCount?: number;
  sentimentAvgScore?: number | null;
  executionAvgScore?: number | null;
  paperAvgScore?: number | null;
  updatedAt?: string;
  completedAt?: string | null;
};

export function setupWebSocketServer(server: HttpServer): Server {
  io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_ORIGIN ?? true,
      credentials: true,
    },
    path: "/socket.io",
  });

  io.on("connection", (socket) => {
    logger.info({ socketId: socket.id }, "Socket.IO client connected");

    socket.on("subscribe_test_run", (testRunId: unknown) => {
      if (typeof testRunId !== "string" || testRunId.trim().length === 0) return;
      socket.join(testRunRoom(testRunId));
      socket.emit("subscribed_test_run", { testRunId });
    });

    socket.on("unsubscribe_test_run", (testRunId: unknown) => {
      if (typeof testRunId !== "string" || testRunId.trim().length === 0) return;
      socket.leave(testRunRoom(testRunId));
    });

    socket.on("subscribe_leaderboard", () => {
      socket.join("leaderboard");
      socket.emit("subscribed_leaderboard", { ok: true });
    });

    socket.on("unsubscribe_leaderboard", () => {
      socket.leave("leaderboard");
    });
  });

  return io;
}

export function emitPipelineProgress(payload: PipelineProgressPayload): void {
  io?.to(testRunRoom(payload.testRunId)).emit("pipeline_progress", payload);
}

export function emitLeaderboardUpdate(payload: unknown): void {
  io?.to("leaderboard").emit("leaderboard_update", payload);
}

export async function startKafkaLeaderboardForwarder(): Promise<void> {
  const brokers = (process.env.KAFKA_BROKERS ?? "")
    .split(",")
    .map((broker) => broker.trim())
    .filter((broker) => broker.length > 0);

  if (brokers.length === 0) {
    logger.info("KAFKA_BROKERS not set; Socket.IO Kafka forwarder disabled");
    return;
  }

  const kafka = new Kafka({
    clientId: process.env.KAFKA_CLIENT_ID ?? "iicpc-api-server",
    brokers,
  });
  const consumer = kafka.consumer({
    groupId: process.env.KAFKA_GROUP_ID ?? "iicpc-api-server-websocket",
  });

  await consumer.connect();
  await consumer.subscribe({
    topic: process.env.KAFKA_LEADERBOARD_TOPIC ?? "leaderboard-updates",
    fromBeginning: false,
  });

  await consumer.run({
    eachMessage: async ({ message }) => {
      if (!message.value) return;
      const text = message.value.toString("utf8");
      try {
        emitLeaderboardUpdate(JSON.parse(text));
      } catch {
        emitLeaderboardUpdate({ raw: text });
      }
    },
  });

  logger.info({ brokers }, "Kafka leaderboard websocket forwarder started");
}

function testRunRoom(testRunId: string): string {
  return `test-run:${testRunId}`;
}
