import { createAuthClient } from "better-auth/react";

const getBaseURL = () => {
  // If running locally, use localhost
  if (window.location.hostname === "localhost") {
    return "http://localhost:3000";
  }
  // Use the same domain but point to /api
  return `${import.meta.env.VITE_FRONTEND_URL}/api/auth`;
};

export const authClient = createAuthClient({
  baseURL: getBaseURL(),
});

export const { signIn, signUp, useSession, signOut } = authClient;
