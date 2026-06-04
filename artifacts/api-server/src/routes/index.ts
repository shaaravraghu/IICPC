import { Router, type IRouter } from "express";
import healthRouter from "./health";
import profileRouter from "./profile";
import submissionsRouter from "./submissions";
import leaderboardRouter from "./leaderboard";
import pipelineRouter from "./pipeline";
import functionsRouter from "./functions";
import botfleetRouter from "./botfleet";
import executionsRouter from "./executions";
import marketDataRouter from "./marketData";
import paperTradingRouter from "./paperTrading";

const router: IRouter = Router();

router.use(healthRouter);
router.use(profileRouter);
router.use(submissionsRouter);
router.use(leaderboardRouter);
router.use(pipelineRouter);
router.use(functionsRouter);
router.use(botfleetRouter);
router.use(executionsRouter);
router.use(marketDataRouter);
router.use(paperTradingRouter);

export default router;
