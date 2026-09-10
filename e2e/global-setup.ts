import { chromium, type FullConfig } from "@playwright/test";
import { mkdirSync } from "fs";
import path from "path";

import { resetDatabase, seedDatabase, testDb } from "./db";
import { createSessionCookie } from "./auth";
import { BASE_URL } from "./constants";

export default async function globalSetup(_config: FullConfig) {
  await testDb.connect();
  await resetDatabase();
  const { admin, member, pending } = await seedDatabase();

  const authDir = path.join(__dirname, ".auth");
  mkdirSync(authDir, { recursive: true });

  const browser = await chromium.launch();

  const adminContext = await browser.newContext();
  await adminContext.addCookies([
    await createSessionCookie(
      {
        id: admin.id,
        role: admin.role,
        status: admin.status,
        email: admin.email,
        name: admin.name,
      },
      BASE_URL,
    ),
  ]);
  await adminContext.storageState({ path: path.join(authDir, "admin.json") });
  await adminContext.close();

  const memberContext = await browser.newContext();
  await memberContext.addCookies([
    await createSessionCookie(
      {
        id: member.id,
        role: member.role,
        status: member.status,
        email: member.email,
        name: member.name,
      },
      BASE_URL,
    ),
  ]);
  await memberContext.storageState({
    path: path.join(authDir, "member.json"),
  });
  await memberContext.close();

  const pendingContext = await browser.newContext();
  await pendingContext.addCookies([
    await createSessionCookie(
      {
        id: pending.id,
        role: pending.role,
        status: pending.status,
        email: pending.email,
        name: pending.name,
      },
      BASE_URL,
    ),
  ]);
  await pendingContext.storageState({
    path: path.join(authDir, "pending.json"),
  });
  await pendingContext.close();

  await browser.close();
  await testDb.end();
}
