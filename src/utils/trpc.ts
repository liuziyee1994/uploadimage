import { initTRPC, TRPCError } from "@trpc/server";
import { getServerSession } from "@/server/auth";
import { createCallerFactory } from "@trpc/server/unstable-core-do-not-import";

export async function createTRPCContext() {
  const session = await getServerSession();

  return {
    session,
  }
}

const t = initTRPC.context<typeof createTRPCContext>().create();

const { router, procedure } = t;

const logMiddleware = t.middleware(async ({ ctx, next }) => {
  const start = Date.now();
  const result = await next();
  console.log("api time: ", Date.now() - start);
  return result;
});

const checkLoginMiddleware = t.middleware(async ({ ctx, next }) => {
  if (!ctx.session?.user) {
    throw new TRPCError({
      code: "FORBIDDEN",
    });
  }

  return next();
});

const logProcedure = procedure.use(logMiddleware);
const checkLoginProcedure = procedure.use(checkLoginMiddleware);

export const testRouter = router({
  hello: logProcedure.query(async ({ ctx }) => {
    return {
      hello: "world"
    }
  })
})

export type TestRouter = typeof testRouter;

export const serverCaller = createCallerFactory()(testRouter);