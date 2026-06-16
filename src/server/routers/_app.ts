import { router, publicProcedure } from "../trpc";
import { profileRouter } from "./profile";
import { carbonRouter } from "./carbon";
import { actionsRouter } from "./actions";
import { receiptsRouter } from "./receipts";
import { cohortsRouter } from "./cohorts";

export const appRouter = router({
  healthcheck: publicProcedure.query(() => {
    return { status: "healthy", timestamp: new Date().toISOString() };
  }),
  profile: profileRouter,
  carbon: carbonRouter,
  actions: actionsRouter,
  receipts: receiptsRouter,
  cohorts: cohortsRouter,
});

export type AppRouter = typeof appRouter;
