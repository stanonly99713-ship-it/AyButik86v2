import { jwtVerify, SignJWT } from "jose";

const COOKIE_NAME = "ab86_session";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 30; // 30 дней — мама не должна логиниться заново каждую неделю
const RENEW_THRESHOLD_SECONDS = 60 * 60 * 24 * 20; // продлеваем, если осталось меньше 20 дней

function secretKey() {
  const secret = process.env.AUTH_SECRET;
  if (!secret) throw new Error("AUTH_SECRET не задан — добавьте его в .env.local");
  return new TextEncoder().encode(secret);
}

export const SESSION_COOKIE = COOKIE_NAME;
export const SESSION_MAX_AGE = MAX_AGE_SECONDS;

export async function createSessionToken(): Promise<string> {
  return new SignJWT({ sub: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE_SECONDS}s`)
    .sign(secretKey());
}

/** Возвращает payload, если токен валиден, иначе null — без исключений на каждый чих. */
export async function verifySessionToken(token: string): Promise<{ exp: number } | null> {
  try {
    const { payload } = await jwtVerify(token, secretKey());
    return payload as { exp: number };
  } catch {
    return null;
  }
}

/** true, если токен ещё валиден, но приближается к истечению — пора перевыпустить. */
export function shouldRenew(exp: number): boolean {
  const secondsLeft = exp - Math.floor(Date.now() / 1000);
  return secondsLeft < RENEW_THRESHOLD_SECONDS;
}
