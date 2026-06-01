import { Router, type IRouter } from "express";
import { eq, count, max } from "drizzle-orm";
import { db, usersTable, submissionsTable } from "@workspace/db";
import {
  GetProfileResponse,
  UpdateProfileBody,
  UpdateProfileResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

// GET /profile — current user's profile (JIT-provision if needed)
router.get("/profile", async (req, res): Promise<void> => {
  const clerkId = req.auth?.userId;
  if (!clerkId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  let [user] = await db.select().from(usersTable).where(eq(usersTable.clerkId, clerkId));

  // JIT provisioning
  if (!user) {
    const email = (req.auth as Record<string, unknown> & { emailAddress?: string })?.emailAddress ?? "";
    const username = email.split("@")[0] ?? clerkId.slice(0, 12);
    [user] = await db.insert(usersTable).values({ clerkId, username, email }).returning();
  }

  // submission stats
  const [statsRow] = await db
    .select({ total: count(), best: max(submissionsTable.compositeScore) })
    .from(submissionsTable)
    .where(eq(submissionsTable.userId, clerkId));

  // rank: count of unique users with a higher best composite score
  const rankRows = await db
    .select({ userId: submissionsTable.userId, best: max(submissionsTable.compositeScore) })
    .from(submissionsTable)
    .groupBy(submissionsTable.userId);

  const myBest = statsRow?.best ?? null;
  const rank = myBest != null ? rankRows.filter((r) => (r.best ?? 0) > myBest).length + 1 : null;

  const profile = {
    id: user.id,
    clerkId: user.clerkId,
    username: user.username,
    email: user.email,
    bio: user.bio ?? null,
    githubUrl: user.githubUrl ?? null,
    teamName: user.teamName ?? null,
    totalSubmissions: statsRow?.total ?? 0,
    bestScore: myBest,
    rank,
    createdAt: user.createdAt.toISOString(),
  };

  res.json(GetProfileResponse.parse(profile));
});

// PATCH /profile — update current user's profile
router.patch("/profile", async (req, res): Promise<void> => {
  const clerkId = req.auth?.userId;
  if (!clerkId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const parsed = UpdateProfileBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const updateData: Partial<{ username: string; bio: string; githubUrl: string; teamName: string }> = {};
  if (parsed.data.username != null) updateData.username = parsed.data.username;
  if (parsed.data.bio != null) updateData.bio = parsed.data.bio;
  if (parsed.data.githubUrl != null) updateData.githubUrl = parsed.data.githubUrl;
  if (parsed.data.teamName != null) updateData.teamName = parsed.data.teamName;

  const [user] = await db
    .update(usersTable)
    .set(updateData)
    .where(eq(usersTable.clerkId, clerkId))
    .returning();

  if (!user) {
    res.status(404).json({ error: "Profile not found" });
    return;
  }

  const [statsRow] = await db
    .select({ total: count(), best: max(submissionsTable.compositeScore) })
    .from(submissionsTable)
    .where(eq(submissionsTable.userId, clerkId));

  const rankRows = await db
    .select({ userId: submissionsTable.userId, best: max(submissionsTable.compositeScore) })
    .from(submissionsTable)
    .groupBy(submissionsTable.userId);

  const myBest = statsRow?.best ?? null;
  const rank = myBest != null ? rankRows.filter((r) => (r.best ?? 0) > myBest).length + 1 : null;

  const profile = {
    id: user.id,
    clerkId: user.clerkId,
    username: user.username,
    email: user.email,
    bio: user.bio ?? null,
    githubUrl: user.githubUrl ?? null,
    teamName: user.teamName ?? null,
    totalSubmissions: statsRow?.total ?? 0,
    bestScore: myBest,
    rank,
    createdAt: user.createdAt.toISOString(),
  };

  res.json(UpdateProfileResponse.parse(profile));
});

export default router;
