import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react()],
    preview: {
      host: true,
      allowedHosts: true,
    },
    server: {
      allowedHosts: [
        "localhost",
        new URL(env.VITE_PROD_URL || "http://localhost").hostname,
      ],
    },
  };
});
