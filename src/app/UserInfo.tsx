"use client"

import { SessionProvider as NextAuthSessionProvider, useSession } from "next-auth/react"

export function UserInfo() {
  const session = useSession();

  console.log(session);

  return <div>{session.data?.user?.name}</div>
}

export function SessionProvider(props: any) {
  return <NextAuthSessionProvider {...props}></NextAuthSessionProvider>
}