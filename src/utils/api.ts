import { createTRPCReact } from "@trpc/react-query";
import { httpBatchLink, createTRPCClient } from "@trpc/client";
import type { AppRouter } from "@/server/router";

export const trpc = createTRPCReact<AppRouter>({});

export const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: 'http://localhost:3000/api/trpc',
    }),
  ],
});

export const trpcPureClient = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: 'http://localhost:3000/api/trpc',
    }),
  ],
});