import { Router, type IRouter } from "express";
import { GetBotFleetStatusResponse } from "@workspace/api-zod";

const router: IRouter = Router();

const INFRA_CONFIG = {
  messageTransport: process.env.MESSAGE_TRANSPORT ?? "nats",
  orchestrator: process.env.ORCHESTRATOR ?? "swarm",
};

// GET /botfleet/status
router.get("/botfleet/status", async (_req, res): Promise<void> => {
  const isKafka = INFRA_CONFIG.messageTransport === "kafka";
  const isK8s = INFRA_CONFIG.orchestrator === "kubernetes";

  const classes = [
    {
      class: "technical" as const,
      count: 100,
      activeCount: 98,
      status: "running" as const,
      ordersPerSecond: 42000,
      description: `High-frequency momentum bots using ${isKafka ? "Rust" : "Go"} — technical indicators`,
    },
    {
      class: "fundamental" as const,
      count: 50,
      activeCount: 49,
      status: "running" as const,
      ordersPerSecond: 18000,
      description: "Value-based bots — mean-reversion on macro events",
    },
    {
      class: "sentiment" as const,
      count: 50,
      activeCount: 47,
      status: "running" as const,
      ordersPerSecond: 12000,
      description: "News-driven bots — sentiment signal order flow",
    },
  ];

  const totalBots = classes.reduce((s, c) => s + c.count, 0);
  const activeBots = classes.reduce((s, c) => s + c.activeCount, 0);

  res.json(
    GetBotFleetStatusResponse.parse({
      totalBots,
      activeBots,
      classes,
      messageTransport: INFRA_CONFIG.messageTransport,
      orchestrator: isK8s ? "kubernetes" : "swarm",
    })
  );
});

export default router;
