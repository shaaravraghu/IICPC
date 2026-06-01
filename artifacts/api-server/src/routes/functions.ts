import { Router, type IRouter } from "express";
import { eq, like, or } from "drizzle-orm";
import { db, functionsTable } from "@workspace/db";
import {
  ListFunctionsQueryParams,
  ListFunctionsResponse,
  GetFunctionParams,
  GetFunctionResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

function parseRow(row: typeof functionsTable.$inferSelect) {
  const params = (() => {
    try { return JSON.parse(row.parametersJson); } catch { return []; }
  })();
  const tags = (() => {
    try { return JSON.parse(row.tagsJson); } catch { return []; }
  })();
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    description: row.description,
    signature: row.signature,
    codeExample: row.codeExample,
    parameters: params,
    returns: row.returns,
    tags,
    parametersJson: row.parametersJson,
    tagsJson: row.tagsJson,
  };
}

// GET /functions
router.get("/functions", async (req, res): Promise<void> => {
  const parsed = ListFunctionsQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { category, q } = parsed.data;

  let query = db.select().from(functionsTable);

  if (category && q) {
    query = query.where(
      or(
        eq(functionsTable.category, category),
        like(functionsTable.name, `%${q}%`),
        like(functionsTable.description, `%${q}%`)
      )
    ) as typeof query;
  } else if (category) {
    query = query.where(eq(functionsTable.category, category)) as typeof query;
  } else if (q) {
    query = query.where(
      or(
        like(functionsTable.name, `%${q}%`),
        like(functionsTable.description, `%${q}%`)
      )
    ) as typeof query;
  }

  const rows = await query;

  res.json(
    ListFunctionsResponse.parse(
      rows.map((row) => {
        const p = parseRow(row);
        return {
          id: p.id,
          name: p.name,
          category: p.category,
          description: p.description,
          signature: p.signature,
          codeExample: p.codeExample,
          parameters: p.parameters,
          returns: p.returns,
          tags: p.tags,
          parametersJson: p.parametersJson,
          tagsJson: p.tagsJson,
        };
      })
    )
  );
});

// GET /functions/:id
router.get("/functions/:id", async (req, res): Promise<void> => {
  const params = GetFunctionParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [row] = await db
    .select()
    .from(functionsTable)
    .where(eq(functionsTable.id, params.data.id));

  if (!row) {
    res.status(404).json({ error: "Function not found" });
    return;
  }

  const p = parseRow(row);
  res.json(
    GetFunctionResponse.parse({
      id: p.id,
      name: p.name,
      category: p.category,
      description: p.description,
      signature: p.signature,
      codeExample: p.codeExample,
      parameters: p.parameters,
      returns: p.returns,
      tags: p.tags,
      parametersJson: p.parametersJson,
      tagsJson: p.tagsJson,
    })
  );
});

export default router;
