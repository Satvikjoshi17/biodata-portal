import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AdminLoginForm } from "@/components/AdminLoginForm";

export const metadata = {
  title: "Admin Login | Samaj Biodata Portal",
};

export default async function AdminLoginPage() {
  const cookieStore = await cookies();
  const auth = cookieStore.get("admin_auth");
  if (auth && auth.value === "authenticated_session") {
    redirect("/admin/dashboard");
  }

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <AdminLoginForm />
    </div>
  );
}
