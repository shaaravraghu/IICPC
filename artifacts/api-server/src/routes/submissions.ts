import { Router, type IRouter } from "express";
import { eq, desc, and } from "drizzle-orm";
import { randomUUID } from "crypto";
import { db, submissionsTable, testRunsTable, usersTable } from "@workspace/db";
import {
  ListSubmissionsQueryParams,
  ListSubmissionsResponse,
  CreateSubmissionBody,
  GetSubmissionResponse,
  GetSubmissionParams,
  RunSubmissionParams,
  RunSubmissionBody,
  GetSubmissionTelemetryParams,
  GetSubmissionTelemetryResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

// GET /submissions
router.get("/submissions", async (req, res): Promise<void> => {
  const parsed = ListSubmissionsQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { userId, limit } = parsed.data;

  const rows = await db
    .select()
    .from(submissionsTable)
    .where(userId ? eq(submissionsTable.userId, userId) : undefined)
    .orderBy(desc(submissionsTable.createdAt))
    .limit(limit);

  res.json(
    ListSubmissionsResponse.parse(
      rows.map((s) => ({
        ...s,
        createdAt: s.createdAt.toISOString(),
        completedAt: s.completedAt?.toISOString() ?? null,
      }))
    )
  );
});

// POST /submissions
router.post("/submissions", async (req, res): Promise<void> => {
  const clerkId = req.auth?.userId;
  if (!clerkId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const parsed = CreateSubmissionBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  // Get or create user to get username
  let [user] = await db.select().from(usersTable).where(eq(usersTable.clerkId, clerkId));
  if (!user) {
    const email = "";
    const username = clerkId.slice(0, 12);
    [user] = await db.insert(usersTable).values({ clerkId, username, email }).returning();
  }

  const [submission] = await db
    .insert(submissionsTable)
    .values({
      id: randomUUID(),
      userId: clerkId,
      username: user.username,
      teamName: user.teamName,
      language: parsed.data.language,
      filename: parsed.data.filename,
      code: parsed.data.code,
      status: "pending",
    })
    .returning();

  res.status(201).json(
    GetSubmissionResponse.parse({
      ...submission,
      createdAt: submission.createdAt.toISOString(),
      completedAt: submission.completedAt?.toISOString() ?? null,
    })
  );
});

// GET /submissions/:id
router.get("/submissions/:id", async (req, res): Promise<void> => {
  const params = GetSubmissionParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [submission] = await db
    .select()
    .from(submissionsTable)
    .where(eq(submissionsTable.id, params.data.id));

  if (!submission) {
    res.status(404).json({ error: "Submission not found" });
    return;
  }

  res.json(
    GetSubmissionResponse.parse({
      ...submission,
      createdAt: submission.createdAt.toISOString(),
      completedAt: submission.completedAt?.toISOString() ?? null,
    })
  );
});

// POST /submissions/:id/run — simulate a test run
router.post("/submissions/:id/run", async (req, res): Promise<void> => {
  const params = RunSubmissionParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const bodyParsed = RunSubmissionBody.safeParse(req.body);
  if (!bodyParsed.success) {
    res.status(400).json({ error: bodyParsed.error.message });
    return;
  }

  const [submission] = await db
    .select()
    .from(submissionsTable)
    .where(eq(submissionsTable.id, params.data.id));

  if (!submission) {
    res.status(404).json({ error: "Submission not found" });
    return;
  }

  // Create a test run
  const [run] = await db
    .insert(testRunsTable)
    .values({
      id: randomUUID(),
      submissionId: submission.id,
      status: "queued",
      currentStage: "Building",
      progressPct: 0,
      technicalBotCount: bodyParsed.data.technicalBotCount,
      fundamentalBotCount: bodyParsed.data.fundamentalBotCount,
      sentimentBotCount: bodyParsed.data.sentimentBotCount,
      durationSeconds: bodyParsed.data.durationSeconds,
    })
    .returning();

  // Update submission to building
  await db
    .update(submissionsTable)
    .set({ status: "building" })
    .where(eq(submissionsTable.id, submission.id));

  // Simulate async run: resolve scores after a delay
  simulateRun(submission.id, run.id).catch(() => {});

  res.status(202).json({
    id: run.id,
    submissionId: run.submissionId,
    status: run.status,
    currentStage: run.currentStage ?? null,
    progressPct: run.progressPct ?? null,
    startedAt: run.startedAt.toISOString(),
    completedAt: null,
  });
});

// GET /submissions/:id/telemetry
router.get("/submissions/:id/telemetry", async (req, res): Promise<void> => {
  const params = GetSubmissionTelemetryParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [submission] = await db
    .select()
    .from(submissionsTable)
    .where(eq(submissionsTable.id, params.data.id));

  if (!submission) {
    res.status(404).json({ error: "Submission not found" });
    return;
  }

  if (submission.status !== "completed") {
    res.json(
      GetSubmissionTelemetryResponse.parse({
        submissionId: submission.id,
        p50Latency: null,
        p90Latency: null,
        p99Latency: null,
        peakTps: null,
        avgTps: null,
        totalOrders: null,
        fillAccuracy: null,
        uptimePct: null,
        latencySeries: [],
        tpsSeries: [],
      })
    );
    return;
  }

  // Generate synthetic time series from stored scores
  const latencySeries = generateLatencySeries(submission.p50Latency ?? 2, submission.p99Latency ?? 8);
  const tpsSeries = generateTpsSeries(submission.tps ?? 50000);

  res.json(
    GetSubmissionTelemetryResponse.parse({
      submissionId: submission.id,
      p50Latency: submission.p50Latency ?? null,
      p90Latency: submission.p90Latency ?? null,
      p99Latency: submission.p99Latency ?? null,
      peakTps: submission.tps != null ? submission.tps * 1.2 : null,
      avgTps: submission.tps ?? null,
      totalOrders: submission.totalOrders ?? null,
      fillAccuracy: submission.fillAccuracy ?? null,
      uptimePct: submission.uptimePct ?? null,
      latencySeries,
      tpsSeries,
    })
  );
});

// -- helpers --

function rand(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

function generateLatencySeries(p50: number, p99: number) {
  return Array.from({ length: 60 }, (_, i) => ({
    t: `T+${i}s`,
    v: parseFloat((p50 + Math.sin(i / 4) * (p99 - p50) * 0.3 + rand(-0.5, 0.5)).toFixed(3)),
  }));
}

function generateTpsSeries(avg: number) {
  return Array.from({ length: 60 }, (_, i) => ({
    t: `T+${i}s`,
    v: parseFloat((avg + Math.sin(i / 6) * avg * 0.2 + rand(-avg * 0.05, avg * 0.05)).toFixed(0)),
  }));
}

async function simulateRun(submissionId: string, runId: string) {
  const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

  // Build stage (2s)
  await sleep(2000);
  await db.update(testRunsTable).set({ status: "running", currentStage: "Load Test", progressPct: 30 }).where(eq(testRunsTable.id, runId));
  await db.update(submissionsTable).set({ status: "running" }).where(eq(submissionsTable.id, submissionId));

  // Running stage (4s)
  await sleep(4000);
  await db.update(testRunsTable).set({ currentStage: "Scoring", progressPct: 80 }).where(eq(testRunsTable.id, runId));

  // Scoring (1s)
  await sleep(1000);

  // Generate scores
  const p50 = rand(0.5, 5);
  const p90 = p50 * rand(1.5, 2.5);
  const p99 = p90 * rand(1.5, 3);
  const tps = rand(20000, 150000);
  const fillAccuracy = rand(0.85, 0.99);
  const speedScore = Math.min(100, (1 / p99) * 100 * rand(0.8, 1));
  const stabilityScore = rand(60, 100);
  const correctnessScore = fillAccuracy * 100;
  const compositeScore = speedScore * 0.4 + stabilityScore * 0.3 + correctnessScore * 0.3;
  const totalOrders = Math.round(tps * 60);

  const now = new Date();

  await db.update(submissionsTable).set({
    status: "completed",
    speedScore,
    stabilityScore,
    correctnessScore,
    compositeScore,
    p50Latency: p50,
    p90Latency: p90,
    p99Latency: p99,
    tps,
    totalOrders,
    fillAccuracy,
    uptimePct: rand(0.95, 1.0),
    completedAt: now,
  }).where(eq(submissionsTable.id, submissionId));

  await db.update(testRunsTable).set({
    status: "completed",
    currentStage: "Done",
    progressPct: 100,
    completedAt: now,
  }).where(eq(testRunsTable.id, runId));
}

export default router;
