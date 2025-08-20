-- Add tokens column to user table
ALTER TABLE "user" ADD COLUMN "tokens" integer NOT NULL DEFAULT 0;
