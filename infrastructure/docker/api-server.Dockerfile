FROM node:22-bookworm-slim AS deps

WORKDIR /workspace
RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
COPY tsconfig.json tsconfig.base.json ./
COPY lib ./lib
COPY artifacts/api-server ./artifacts/api-server

RUN pnpm install --frozen-lockfile
RUN pnpm --filter @workspace/api-server build
RUN pnpm deploy --filter @workspace/api-server --prod /app

FROM node:22-bookworm-slim AS runtime

WORKDIR /app
ENV NODE_ENV=production
COPY --from=deps /app /app

EXPOSE 3000
CMD ["node", "--enable-source-maps", "./dist/index.mjs"]
