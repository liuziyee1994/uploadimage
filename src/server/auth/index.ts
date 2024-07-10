import { AuthOptions, DefaultSession } from "next-auth";
import GitlabProvider from "next-auth/providers/gitlab";
import { db } from "@/server/db/db";
import { Adapter } from "next-auth/adapters";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { getServerSession as nextAuthGetServerSession } from "next-auth/next";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}

export const authOptions: AuthOptions = {
  adapter: DrizzleAdapter(db) as Adapter,
  callbacks: {
    async session({ session, user }) {
      if (session.user && user) {
        session.user.id = user.id;
      }

      return session;
    }
  },
  providers: [
    GitlabProvider({
      clientId: "746673f92658c0489aab705d44ed66aa84c0138649b8b5f44401a531e3e7858c",
      clientSecret: "gloas-39cb863fb3b3ed732de41064c4cc095c76cf3f13fd20c9defda3c3f691cc25ed"
    })
  ],
}

export function getServerSession() {
  return nextAuthGetServerSession(authOptions);
}