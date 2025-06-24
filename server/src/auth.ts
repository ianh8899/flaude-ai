import { betterAuth } from "better-auth";
import Database from "better-sqlite3";
import 'dotenv/config'

export const auth = betterAuth({
    database: new Database("./sqlite.db"),
    emailAndPassword: {
    enabled: true,
  },
  
  trustedOrigins: [
    "http://localhost:5173",
  ],
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    },
  },
})
