import { createTRPCContext, serverCaller } from "@/utils/trpc";

export default async function Home() {
  const data = await serverCaller(createTRPCContext()).hello();

  return (
    <div className="h-screen flex justify-center items-center">
      Dashboard {data?.hello}
    </div>
  )
}