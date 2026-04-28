import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

let dbInstance: PostgresJsDatabase<typeof schema> | null = null;
let queryClient: postgres.Sql | null = null;

/**
 * Get database instance (lazy initialization)
 * Only connects when actually needed at runtime
 */
function getDb(): PostgresJsDatabase<typeof schema> {
  if (!dbInstance) {
    const connectionString = process.env.DATABASE_URL;

    if (!connectionString) {
      throw new Error("DATABASE_URL environment variable is required");
    }

    queryClient = postgres(connectionString);
    dbInstance = drizzle(queryClient, { schema });
  }

  return dbInstance;
}

// Export a proxy that lazily initializes the database
export const db = new Proxy({} as PostgresJsDatabase<typeof schema>, {
  get(_target, prop) {
    const database = getDb();
    const value = database[prop as keyof typeof database];
    if (typeof value === "function") {
      return value.bind(database);
    }
    return value;
  },
});

// Cleanup function for graceful shutdown
export async function closeDb(): Promise<void> {
  if (queryClient) {
    await queryClient.end();
    queryClient = null;
    dbInstance = null;
  }
}

export * from "./schema";
