import { cookies } from "next/headers";
import { supabase } from "@/lib/supabase";
import AdminLogin from "@/components/admin/AdminLogin";
import AdminDashboard from "@/components/admin/AdminDashboard";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Admin Portal | DESH EduHub",
  description: "Administrative past papers management portal.",
};

async function getAdminData() {
  try {
    const [papersRes, usersRes] = await Promise.all([
      supabase
        .from("papers")
        .select("*")
        .order("created_at", { ascending: false }),
      supabase
        .from("users")
        .select("*")
        .order("created_at", { ascending: false }),
    ]);

    return {
      papers: papersRes.data || [],
      users: usersRes.data || [],
    };
  } catch (err) {
    console.error("Error fetching admin data:", err);
    return { papers: [], users: [] };
  }
}

export default async function AdminPage() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("admin_session")?.value;
  const sessionSecret = (
    process.env.ADMIN_SESSION_SECRET || "desh-papers-hub-admin-secret-2026"
  ).trim();

  const isAuthenticated = Boolean(sessionCookie && sessionCookie === sessionSecret);

  if (!isAuthenticated) {
    return <AdminLogin />;
  }

  const { papers, users } = await getAdminData();

  return <AdminDashboard initialPapers={papers} initialUsers={users} />;
}
