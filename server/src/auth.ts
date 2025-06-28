import { betterAuth } from "better-auth";
import Database from "better-sqlite3";
import "dotenv/config";

export const auth = betterAuth({
  database: new Database("./sqlite.db"),
  emailAndPassword: {
    enabled: true,
  },
  trustedOrigins: [
    "http://localhost:5173",
    "http://localhost:4173",
    process.env.PROD_URL!,
  ],
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    },
  },
  user: {
    additionalFields: {
      tokens: {
        type: "number",
        defaultValue: 0,
        required: false,
      },
    },
  },
});
