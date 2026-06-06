import { db, submissionsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { logger } from "./logger";

export async function submitToRustPipeline(
  runId: string,
  submissionId: string,
  strategyYaml: string | null,
  assets: string[]
): Promise<{ ok: boolean; error?: string }> {
  const rustPipelineUrl = process.env.RUST_PIPELINE_URL;
  if (!rustPipelineUrl) {
    logger.info("RUST_PIPELINE_URL not configured. Skipping Rust pipeline submission.");
    return { ok: true };
  }

  try {
    let yaml = strategyYaml;
    let userId: string | undefined;
    let username: string | undefined;
    let teamName: string | null | undefined;
    let filename: string | undefined;

    // Fetch submission details from DB
    const [submission] = await db
      .select()
      .from(submissionsTable)
      .where(eq(submissionsTable.id, submissionId));

    if (submission) {
      yaml = yaml || submission.code;
      userId = submission.userId;
      username = submission.username;
      teamName = submission.teamName;
      filename = submission.filename;
    } else {
      logger.warn(`Submission with ID ${submissionId} not found in database.`);
    }

    const payload = {
      submission_id: submissionId,
      run_id: runId,
      user_id: userId,
      username: username,
      team_name: teamName,
      filename: filename,
      strategy_yaml: yaml || undefined,
      assets: assets,
    };

    logger.info(`Sending submission ${submissionId} (run: ${runId}) to Rust pipeline at ${rustPipelineUrl}`);

    const response = await fetch(`${rustPipelineUrl}/api/submissions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const responseText = await response.text();
      throw new Error(`Rust pipeline responded with status ${response.status}: ${responseText}`);
    }

    const data = await response.json();
    logger.info(`Successfully submitted to Rust pipeline: ${JSON.stringify(data)}`);
    return { ok: true };
  } catch (error: any) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    logger.error(`Failed to submit to Rust pipeline: ${errorMsg}`);
    return { ok: false, error: errorMsg };
  }
}
