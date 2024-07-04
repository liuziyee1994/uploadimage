import { fileRoutes } from "@/server/routes/file";
import { router } from "@/server/trpc";

export const appRouter = router({
  file: fileRoutes,
})

export type AppRouter = typeof appRouter;