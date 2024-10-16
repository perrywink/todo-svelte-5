import { drizzle } from "drizzle-orm/connect";
import { DB_URL } from "$env/static/private";

export const db = await drizzle("libsql", DB_URL);