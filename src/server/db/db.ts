import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from "./schema"

const queryClient = postgres("postgres://postgres:12345@localhost:5432/uploadimage");
export const db = drizzle(queryClient, {schema});