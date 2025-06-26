import Database from "better-sqlite3";

const db = new Database("./sqlite.db");

try {
  const userId = "HNacogNKQkpPTk7rkZtq0mGVt1deipkO";

  // Update user tokens and name
  const stmt = db.prepare(`
    UPDATE user 
    SET tokens = ?, name = ?, updatedAt = datetime('now') 
    WHERE id = ?
  `);

  const result = stmt.run(100, "User", userId);

  if (result.changes > 0) {
    console.log(`✅ Successfully updated user ${userId}:`);
    console.log(`   - Set tokens to 100`);
    console.log(`   - Set name to "User"`);

    // Verify the update
    const verifyStmt = db.prepare(
      "SELECT id, name, email, tokens FROM user WHERE id = ?"
    );
    const user = verifyStmt.get(userId);
    console.log("\nUpdated user data:", user);
  } else {
    console.log(`❌ No user found with ID: ${userId}`);
  }
} catch (error) {
  console.error("❌ Error updating user:", error);
} finally {
  db.close();
}
