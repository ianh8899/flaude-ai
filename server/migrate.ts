import Database from "better-sqlite3";

const db = new Database("./sqlite.db");

try {
  // Check if tokens column already exists
  const columns = db.prepare("PRAGMA table_info(user)").all();
  const hasTokensColumn = columns.some((col: any) => col.name === "tokens");

  if (!hasTokensColumn) {
    console.log("Adding tokens column to user table...");
    db.exec("ALTER TABLE user ADD COLUMN tokens integer NOT NULL DEFAULT 0;");
    console.log("✅ Successfully added tokens column to user table");
  } else {
    console.log("ℹ️ Tokens column already exists in user table");
  }

  // Show current schema
  console.log("\nCurrent user table schema:");
  const updatedColumns = db.prepare("PRAGMA table_info(user)").all();
  updatedColumns.forEach((col: any) => {
    console.log(
      `- ${col.name}: ${col.type} ${col.notnull ? "NOT NULL" : ""} ${
        col.dflt_value ? `DEFAULT ${col.dflt_value}` : ""
      }`
    );
  });
} catch (error) {
  console.error("❌ Migration failed:", error);
} finally {
  db.close();
}
