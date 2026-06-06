FROM rust:1.82-bookworm AS builder

WORKDIR /workspace
RUN apt-get update \
  && apt-get install -y --no-install-recommends cmake pkg-config libssl-dev \
  && rm -rf /var/lib/apt/lists/*

COPY Cargo.toml Cargo.lock ./
COPY libs ./libs
COPY services ./services

ARG SERVICE
RUN cargo build --release --bin "${SERVICE}"

FROM debian:bookworm-slim AS runtime

WORKDIR /app
RUN apt-get update \
  && apt-get install -y --no-install-recommends ca-certificates libssl3 \
  && rm -rf /var/lib/apt/lists/*

ARG SERVICE
COPY --from=builder /workspace/target/release/${SERVICE} /app/service

ENV RUST_LOG=info
EXPOSE 8080
ENTRYPOINT ["/app/service"]
