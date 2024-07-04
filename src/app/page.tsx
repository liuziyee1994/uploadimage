"use client";

import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { Textarea } from "@/components/Textarea";
import { UserInfo, SessionProvider } from "@/app/UserInfo";
import { trpc } from "@/utils/api";

export default function Home() {
  const { data, isLoading, isError } = trpc.hello.useQuery(
    void 0,
    {
      refetchOnWindowFocus: false,
    }
  );

  return (
    <div className="h-screen flex justify-center items-center">
      <form className="w-full max-w-md flex flex-col gap-4">
        <h1 className="text-center text-2xl font-bold">Create App</h1>
        <Input name="name" placeholder="App Name"></Input>
        <Textarea
          name="description"
          placeholder="Description">
        </Textarea>
        <Button type="submit">Submit</Button>
        {data?.hello}
        {isLoading && "Loading..."}
        {isError && "Error"}
      </form>
      <SessionProvider>
        <UserInfo/>
      </SessionProvider>
    </div>
  )
}