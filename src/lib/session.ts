// Отдельно от lib/auth.ts: этот файл использует next/headers (cookies()),
// который недоступен в Edge-рантайме src/proxy.ts. auth.ts импортируется
// оттуда напрямую, а session.ts — только из Node-кода (route handlers,
// server actions, серверные компоненты), чтобы не тащить next/headers в
// Edge-бандл middleware.
import { cookies } from "next/headers";
import { SESSION_COOKIE, verifySessionToken } from "./auth";

/** null, если сессии нет или она истекла — используется в route handlers/actions вне proxy.ts */
export async function getSession() {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}
