import path from "path";
import dotenv from "dotenv";
import { defineConfig, devices } from "@playwright/test";

// Loads the isolated test DB / test secrets — never the real .env — before the
// config, globalSetup, and the spawned `next dev` webServer all read process.env.
dotenv.config({ path: path.resolve(__dirname, ".env.test") });

import { BASE_URL, PORT } from "./e2e/constants";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: "html",
  globalSetup: require.resolve("./e2e/global-setup"),
  use: {
    baseURL: BASE_URL,
    trace: "on-first-retry",
  },
  webServer: {
    command: `npx next dev -p ${PORT}`,
    url: BASE_URL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    env: process.env as Record<string, string>,
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
