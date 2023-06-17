import { createHTTPServer } from "@trpc/server/adapters/standalone";
import { publicProcedure, router } from "./trpc.js";
import cors from "cors";
import { createBookmark, createBookmarkSchema } from "pet";

const appRouter = router({
  ping: publicProcedure.query(async () => {
    return "pong";
  }),
  createBookmark: publicProcedure
    .input(createBookmarkSchema)
    .mutation(({ input }) => createBookmark(input)),
});

export type AppRouter = typeof appRouter;

const server = createHTTPServer({
  middleware: cors(),
  router: appRouter,
});

server.listen(50957);
