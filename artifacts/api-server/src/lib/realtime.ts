import type { Server as HttpServer } from "http";
import { Server } from "socket.io";
import { desc, eq } from "drizzle-orm";
import {
  assetScoresTable,
  db,
  testRunsDetailedTable,
} from "@workspace/db";
import { logger } from "./logger";

let io: Server | null = null;

type RoomPayload = string | { room?: string };

function roomFromPayload(payload: RoomPayload): string | null {
  if (typeof payload === "string") return payload;
  return payload.room ?? null;
}

export function initializeRealtime(server: HttpServer) {
  io = new Server(server, {
    path: "/socket.io",
    cors: {
      origin: true,
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    const joinRoom = (payload: RoomPayload) => {
      const room = roomFromPayload(payload);
      if (room) socket.join(room);
    };

    const leaveRoom = (payload: RoomPayload) => {
      const room = roomFromPayload(payload);
      if (room) socket.leave(room);
    };

    socket.on("room:join", joinRoom);
    socket.on("subscribe", joinRoom);
    socket.on("room:leave", leaveRoom);
    socket.on("unsubscribe", leaveRoom);
  });

  logger.info("Realtime socket server initialized");
  return io;
}

export async function emitRunStatus(testRunId: string): Promise<void> {
  if (!io) return;

  const [run] = await db
    .select()
    .from(testRunsDetailedTable)
    .where(eq(testRunsDetailedTable.testRunId, testRunId));

  if (!run) return;

  const payload = {
    testRunId: run.testRunId,
    submissionId: run.submissionId,
    status: run.status,
    currentLayer: run.currentLayer,
    progressPct: run.progressPct,
    assetsTotal: run.assetsTotal,
    assetsAnalyzed: run.assetsAnalyzed,
    technicalPassCount: run.technicalPassCount,
    fundamentalPassCount: run.fundamentalPassCount,
    sentimentPassCount: run.sentimentPassCount,
    sentimentAvgScore: run.sentimentAvgScore,
    executionAvgScore: run.executionAvgScore,
    paperAvgScore: run.paperAvgScore,
    startedAt: run.startedAt.toISOString(),
    updatedAt: run.updatedAt.toISOString(),
    completedAt: run.completedAt?.toISOString() ?? null,
  };

  io.to(`test-run:${testRunId}`).emit("execution:status", payload);
  io.to(`test-run:${testRunId}`).emit("pipeline:status", payload);
}

export async function emitLeaderboard(testRunId: string): Promise<void> {
  if (!io) return;

  const rows = await db
    .select()
    .from(assetScoresTable)
    .where(eq(assetScoresTable.testRunId, testRunId))
    .orderBy(desc(assetScoresTable.compositeScore));

  const payload = rows.map((row, index) => ({
    rank: row.compositeRank ?? index + 1,
    assetId: row.assetId,
    symbol: row.symbol,
    sentimentScore: row.sentimentScore ?? null,
    executionScore: row.executionScore ?? null,
    paperScore: row.paperScore ?? null,
    compositeScore: row.compositeScore ?? null,
    technicalScore: row.technicalScore ?? null,
    fundamentalScore: row.fundamentalScore ?? null,
    technicalPass: row.technicalPass === 1,
    fundamentalPass: row.fundamentalPass === 1,
    rejectedAtLayer: row.rejectedAtLayer,
    rejectionReason: row.rejectionReason,
    team: null,
    submissionId: null,
    testRunId,
    timestamp: row.updatedAt.toISOString(),
  }));

  io.to("leaderboard").emit("leaderboard:update", { testRunId, rows: payload });
  io.to(`leaderboard:${testRunId}`).emit("leaderboard:update", { testRunId, rows: payload });
}
