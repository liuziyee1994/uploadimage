import NextAuth from "next-auth";
import { authOptions } from "@/server/auth";

let handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
