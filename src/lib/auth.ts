import { sign, verify, JwtPayload, SignOptions } from "jsonwebtoken";

export type SessionPayload = {
  sub: string; // user id
  username: string;
  role:
    | "administrator"
    | "suboperator"
    | "master-agent"
    | "sub-agent"
    | "agent"
    | "player"
    | "declarator";
};

const SECRET = process.env.SESSION_SECRET || "dev-insecure-secret";

export function signSession(payload: SessionPayload) {
  const opts: SignOptions = { algorithm: "HS256", expiresIn: "7d" };
  return sign(payload, SECRET, opts);
}

export function verifySession(token: string): SessionPayload | null {
  try {
    const decoded = verify(token, SECRET) as JwtPayload | string;
    if (typeof decoded === "string") return null;
    const { sub, username, role } = decoded as SessionPayload;
    if (!sub || !username || !role) return null;
    return decoded as SessionPayload;
  } catch {
    return null;
  }
}
