import Database from "better-sqlite3";

const db = new Database("./sqlite.db");

export const addTokensToUser = (userId: string, tokenAmount: number) => {
  try {
    const stmt = db.prepare(`
      UPDATE user 
      SET tokens = tokens + ?, updatedAt = datetime('now') 
      WHERE id = ?
    `);
    const result = stmt.run(tokenAmount, userId);

    if (result.changes === 0) {
      throw new Error(`User with ID ${userId} not found`);
    }

    console.log(`Added ${tokenAmount} tokens to user ${userId}`);
    return result;
  } catch (error) {
    console.error("Error adding tokens to user:", error);
    throw error;
  }
};

export const reduceUserTokens = (userId: string) => {
  try {
    const stmt = db.prepare(`
      UPDATE user 
      SET tokens = tokens - 1, updatedAt = datetime('now') 
      WHERE id = ?
    `);
    const result = stmt.run(userId);

    if (result.changes === 0) {
      throw new Error(
        `User with ID ${userId} not found or no tokens to reduce`
      );
    }

    console.log(`Reduced 1 token from user ${userId}`);
    return result;
  } catch (error) {
    console.error("Error reducing tokens from user:", error);
    throw error;
  }
};
