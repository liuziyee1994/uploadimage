import { NextRequest, NextResponse } from "next/server";
import { insertUserSchema, updateUserSchema } from "@/server/db/validate-schema";


export function GET(request: NextRequest) {
  let query = request.nextUrl.searchParams;
  let name = query.get("name");
  let email = query.get("email");

  let result = updateUserSchema.safeParse({
    name,
    email,
  });

  if (result.success) {
    return NextResponse.json(result.data);
  } else {
    console.error(result.error);
    return NextResponse.json({error: result.error.message});
  }
}