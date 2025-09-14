import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isRole } from "@/lib/roles";
import { signSession } from "@/lib/auth";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  const ct = req.headers.get("content-type") ?? "";
  let username = "";
  let password = "";

  try {
    if (ct.includes("application/json")) {
      const b = await req.json();
      username = (b?.username ?? "").toString();
      password = (b?.password ?? "").toString();
    } else {
      const f = await req.formData();
      username = (f.get("username") ?? "").toString();
      password = (f.get("password") ?? "").toString();
    }
  } catch {}

  if (!username || !password) {
    return NextResponse.json({ ok: false, error: "Missing credentials" }, { status: 400 });
  }

  // Fetch user (case-insensitive username)
  const r = await db.query<{ id: string; username: string; password_hash: string; role: string }>(
    `select id::text, username, password_hash, role
     from users
     where lower(username) = lower($1)
     limit 1`,
    [username]
  );
  const u = r.rows[0];
  if (!u || !isRole(u.role)) {
    return NextResponse.json({ ok: false, error: "Invalid username or password" }, { status: 401 });
  }

  const ok = await bcrypt.compare(password, u.password_hash);
  if (!ok) {
    return NextResponse.json({ ok: false, error: "Invalid username or password" }, { status: 401 });
  }

  const token = signSession({ sub: u.id, username: u.username, role: u.role });
  const oneWeek = 60 * 60 * 24 * 7;

  const res = NextResponse.json({ ok: true, redirect: "/dashboard" });
  // httpOnly session (JWT)
  res.cookies.set("session", token, {
    httpOnly: true, sameSite: "lax", secure: true, path: "/", maxAge: oneWeek,
  });
  // non-httpOnly role (for simple middleware redirect)
  res.cookies.set("role", u.role, {
    httpOnly: false, sameSite: "lax", secure: true, path: "/", maxAge: oneWeek,
  });

  return res;
}
