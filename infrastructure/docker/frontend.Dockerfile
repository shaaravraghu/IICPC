FROM node:22-bookworm-slim AS builder

WORKDIR /workspace
RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
COPY tsconfig.json tsconfig.base.json ./
COPY lib ./lib
COPY artifacts/iicpc-platform ./artifacts/iicpc-platform

ARG VITE_API_URL=/api
ENV VITE_API_URL=${VITE_API_URL}

RUN pnpm install --frozen-lockfile
RUN pnpm --filter @workspace/iicpc-platform build

FROM nginx:1.27-alpine AS runtime

COPY infrastructure/docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /workspace/artifacts/iicpc-platform/dist /usr/share/nginx/html

EXPOSE 80
