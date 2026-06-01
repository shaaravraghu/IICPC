---
name: FunctionDef DB vs API mapping
description: DB stores parametersJson/tagsJson as text columns; routes parse them to arrays before the API response.
---

## Rule
The `functionsTable` DB schema stores `parametersJson` (text) and `tagsJson` (text). The OpenAPI spec defines `parameters` (array of objects) and `tags` (string array). Routes must parse the JSON strings and map to the array fields before calling `GetFunctionResponse.parse()` or `ListFunctionsResponse.parse()`.

**Why:** Drizzle doesn't support JSON columns with typed parsing in the current setup; storing as text was a deliberate choice for simplicity. Zod strips `parametersJson`/`tagsJson` from the response (they're not in the schema), so callers never see the raw strings.

**How to apply:** Use the `parseRow()` helper in `routes/functions.ts` which does `JSON.parse(row.parametersJson)` → `parameters` array, and similarly for tags.
