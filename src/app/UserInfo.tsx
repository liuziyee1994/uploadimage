"use client"

import {SessionProvider, useSession} from "next-auth/react"

export function UserInfo() {
  const session = useSession();

  console.log(session);

  return <div>{session.data?.user?.name}</div>
}

export function NextAuthSessionProvider(props: any) {
  return <SessionProvider {...props}></SessionProvider>
}