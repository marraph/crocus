import { drizzle } from 'drizzle-orm/neon-http';
import postgres from "postgres";

const sql = postgres("");

export const db = drizzle(sql);