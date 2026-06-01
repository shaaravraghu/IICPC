import { Router, type IRouter } from "express";
import { desc, eq, max, count, and, isNotNull } from "drizzle-orm";
import { db, submissionsTable, usersTable, testRunsTable } from "@workspace/db";
import {
  GetLeaderboardQueryParams,
  GetLeaderboardResponse,
  GetLeaderboardSummaryResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

// GET /leaderboard/summary — must come before /:id style routes
router.get("/leaderboard/summary", async (_req, res): Promise<void> => {
  // Get best submission per user
  const byUser = await db
    .select({
      userId: submissionsTable.userId,
      username: submissionsTable.username,
      teamName: submissionsTable.teamName,
      submissionId: submissionsTable.id,
      compositeScore: submissionsTable.compositeScore,
      speedScore: submissionsTable.speedScore,
      stabilityScore: submissionsTable.stabilityScore,
      correctnessScore: submissionsTable.correctnessScore,
      p99Latency: submissionsTable.p99Latency,
      tps: submissionsTable.tps,
      language: submissionsTable.language,
      completedAt: submissionsTable.completedAt,
    })
    .from(submissionsTable)
    .where(and(eq(submissionsTable.status, "completed"), isNotNull(submissionsTable.compositeScore)))
    .orderBy(desc(submissionsTable.compositeScore));

  // Best per user
  const seen = new Set<string>();
  const bestPerUser: typeof byUser = [];
  for (const row of byUser) {
    if (!seen.has(row.userId)) {
      seen.add(row.userId);
      bestPerUser.push(row);
    }
  }

  const totalParticipants = seen.size;

  const [totalRow] = await db.select({ total: count() }).from(submissionsTable);
  const [activeRow] = await db.select({ active: count() }).from(testRunsTable).where(eq(testRunsTable.status, "running"));

  const top3 = bestPerUser.slice(0, 3).map((row, i) => ({
    rank: i + 1,
    submissionId: row.submissionId,
    userId: row.userId,
    username: row.username,
    teamName: row.teamName ?? null,
    language: row.language,
    compositeScore: row.compositeScore ?? 0,
    speedScore: row.speedScore ?? 0,
    stabilityScore: row.stabilityScore ?? 0,
    correctnessScore: row.correctnessScore ?? 0,
    p99Latency: row.p99Latency ?? null,
    tps: row.tps ?? null,
    completedAt: row.completedAt?.toISOString(),
  }));

  const bestP99 = bestPerUser.reduce<number | null>((min, r) => {
    if (r.p99Latency == null) return min;
    return min == null || r.p99Latency < min ? r.p99Latency : min;
  }, null);

  const bestTps = bestPerUser.reduce<number | null>((max, r) => {
    if (r.tps == null) return max;
    return max == null || r.tps > max ? r.tps : max;
  }, null);

  res.json(
    GetLeaderboardSummaryResponse.parse({
      totalParticipants,
      totalSubmissions: totalRow?.total ?? 0,
      activeRuns: activeRow?.active ?? 0,
      top3,
      bestP99,
      bestTps,
    })
  );
});

// GET /leaderboard
router.get("/leaderboard", async (req, res): Promise<void> => {
  const parsed = GetLeaderboardQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { limit } = parsed.data;

  const rows = await db
    .select({
      userId: submissionsTable.userId,
      username: submissionsTable.username,
      teamName: submissionsTable.teamName,
      submissionId: submissionsTable.id,
      compositeScore: submissionsTable.compositeScore,
      speedScore: submissionsTable.speedScore,
      stabilityScore: submissionsTable.stabilityScore,
      correctnessScore: submissionsTable.correctnessScore,
      p99Latency: submissionsTable.p99Latency,
      tps: submissionsTable.tps,
      language: submissionsTable.language,
      completedAt: submissionsTable.completedAt,
    })
    .from(submissionsTable)
    .where(and(eq(submissionsTable.status, "completed"), isNotNull(submissionsTable.compositeScore)))
    .orderBy(desc(submissionsTable.compositeScore));

  // Best per user
  const seen = new Set<string>();
  const bestPerUser: typeof rows = [];
  for (const row of rows) {
    if (!seen.has(row.userId)) {
      seen.add(row.userId);
      bestPerUser.push(row);
    }
    if (bestPerUser.length >= limit) break;
  }

  const entries = bestPerUser.map((row, i) => ({
    rank: i + 1,
    submissionId: row.submissionId,
    userId: row.userId,
    username: row.username,
    teamName: row.teamName ?? null,
    language: row.language,
    compositeScore: row.compositeScore ?? 0,
    speedScore: row.speedScore ?? 0,
    stabilityScore: row.stabilityScore ?? 0,
    correctnessScore: row.correctnessScore ?? 0,
    p99Latency: row.p99Latency ?? null,
    tps: row.tps ?? null,
    completedAt: row.completedAt?.toISOString(),
  }));

  res.json(GetLeaderboardResponse.parse(entries));
});

export default router;
