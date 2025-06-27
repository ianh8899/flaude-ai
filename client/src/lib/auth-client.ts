import { createAuthClient } from "better-auth/react";

const getBaseURL = () => {
  // If running locally, use localhost
  if (window.location.hostname === "localhost") {
    return "http://localhost:3000";
  }
  // If in production, use your tunneled backend
  return "https://webhooks.ianhitchman.co.uk";
};

export const authClient = createAuthClient({
  baseURL: getBaseURL(),
});

export const { signIn, signUp, useSession, signOut } = authClient;
