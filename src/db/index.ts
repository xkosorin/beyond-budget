import { env } from "@/env.mjs";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const sql = postgres(env.DATABASE_URL, { ssl: "require" });
export const db = drizzle(sql, { schema });
