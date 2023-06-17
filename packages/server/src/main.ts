import { createHTTPServer } from "@trpc/server/adapters/standalone";
import { publicProcedure, router } from "./trpc";
import cors from "cors";

const appRouter = router({
  ping: publicProcedure.query(async () => {
    return "pong";
  }),
});

export type AppRouter = typeof appRouter;

const server = createHTTPServer({
  middleware: cors(),
  router: appRouter,
});

server.listen(50957);
