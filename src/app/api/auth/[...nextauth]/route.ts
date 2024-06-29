import NextAuth, {AuthOptions} from "next-auth";
import GitlabProvider from "next-auth/providers/gitlab";
import {db} from "@/server/db/db";
import {Adapter} from "next-auth/adapters";
import {DrizzleAdapter} from "@auth/drizzle-adapter";

export const authOptions: AuthOptions = {
  adapter: DrizzleAdapter(db) as Adapter,
  providers: [
    GitlabProvider({
      clientId: "746673f92658c0489aab705d44ed66aa84c0138649b8b5f44401a531e3e7858c",
      clientSecret: "gloas-47e826d767041e6e6b837292a574a13f2ace1e96589a5edc8fcb1af93d193972"
    })
  ],
}

let handler = NextAuth(authOptions);

export {handler as GET, handler as POST};
