import express, { type Express, type Request, type Response, type NextFunction } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import router from "./routes";
import { logger } from "./lib/logger";
import {
  CLERK_PROXY_PATH,
  clerkProxyMiddleware,
  getClerkProxyHost,
} from "./middlewares/clerkProxyMiddleware";

const app: Express = express();
const allowedOrigin = process.env.FRONTEND_ORIGIN ?? true;

const clerkSecretKey = process.env.CLERK_SECRET_KEY ?? "";
const isClerkEnabled = clerkSecretKey.length > 0 && clerkSecretKey.startsWith("sk_");

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);

app.use(CLERK_PROXY_PATH, clerkProxyMiddleware());

app.use(cors({ credentials: true, origin: allowedOrigin }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (isClerkEnabled) {
  // Real Clerk auth — only loaded when a valid secret key is present
  const { clerkMiddleware } = await import("@clerk/express");
  const { publishableKeyFromHost } = await import("@clerk/shared/keys");

  app.use(
    clerkMiddleware((req: any) => ({
      publishableKey: publishableKeyFromHost(
        getClerkProxyHost(req) ?? "",
        process.env.CLERK_PUBLISHABLE_KEY,
      ),
    })),
  );
  logger.info("Clerk authentication enabled");
} else {
  // Mock auth for local development — injects a fake userId
  app.use((req: Request, _res: Response, next: NextFunction) => {
    (req as any).auth = { userId: "local-dev-user", sessionId: "local-dev-session" };
    next();
  });
  logger.info("Clerk authentication DISABLED — using mock auth (local dev mode)");
}

app.use("/api", router);

export default app;

