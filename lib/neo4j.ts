import neo4j, { Driver } from "neo4j-driver";

let driver: Driver | null = null;

/**
 * Get or create the Neo4j driver singleton.
 * Lazy initialization — only connects when first called.
 */
export function getDriver(): Driver {
  if (driver) return driver;

  const uri = process.env.NEO4J_URI;
  const username = process.env.NEO4J_USERNAME;
  const password = process.env.NEO4J_PASSWORD;

  if (!uri || !username || !password) {
    throw new Error("Neo4j environment variables not set");
  }

  driver = neo4j.driver(uri, neo4j.auth.basic(username, password));
  return driver;
}

/**
 * Run a read-only Cypher query and return the records.
 */
export async function runQuery(
  cypher: string,
  params: Record<string, unknown> = {}
) {
  const d = getDriver();
  const session = d.session({ database: "neo4j" });

  try {
    const result = await session.run(cypher, params);
    return result.records;
  } finally {
    await session.close();
  }
}

/**
 * Run a write Cypher query (for upserts, creating nodes/relationships).
 */
export async function runWrite(
  cypher: string,
  params: Record<string, unknown> = {}
) {
  const d = getDriver();
  const session = d.session({ database: "neo4j" });

  try {
    const result = await session.run(cypher, params);
    return result;
  } finally {
    await session.close();
  }
}

/**
 * Close the Neo4j driver connection (for cleanup).
 */
export async function closeDriver() {
  if (driver) {
    await driver.close();
    driver = null;
  }
}
