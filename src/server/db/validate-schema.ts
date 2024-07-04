import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { users } from "@/server/db/schema";

export const insertUserSchema = createInsertSchema(users, {
  email: (schema) => schema.email.email(),
});

export const updateUserSchema = insertUserSchema.pick({email: true});

export const selectUserSchema = createSelectSchema(users);
