import { cookies } from "next/headers";
import { redirect, notFound } from "next/navigation";
import { isRole, labelFor } from "@/lib/roles";
import { verifySession } from "@/lib/auth";

export default async function RoleDashboard({
  params,
}: {
  params: { role: string };
}) {
  const roleParam = params.role;
  if (!isRole(roleParam)) return notFound();

  // In Next 15, cookies() returns a Promise
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value || "";
  const session = token ? verifySession(token) : null;

  if (!session) redirect("/login");
  if (session.role !== roleParam) redirect(`/dashboard/${session.role}`);

  return (
    <main className="min-h-screen grid place-items-center p-6">
      <div className="w-full max-w-xl rounded-2xl border p-8 text-center">
        <h1 className="text-2xl font-semibold mb-2">
          {labelFor(session.role)} Dashboard
        </h1>
        <p className="opacity-80">🚧 Coming Soon</p>
        <p className="mt-2 opacity-70">
          Hello, <b>{session.username}</b>
        </p>
        <form action="/api/logout" method="post" className="mt-6">
          <button className="rounded-xl border px-4 py-2">Logout</button>
        </form>
      </div>
    </main>
  );
}
