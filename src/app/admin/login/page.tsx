import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AdminLoginForm } from "@/components/AdminLoginForm";

export const metadata = {
  title: "Admin Login | Paliwal Brahman Samaj",
};

export default async function AdminLoginPage() {
  const cookieStore = await cookies();
  const auth = cookieStore.get("admin_auth");
  if (auth && auth.value === "authenticated_session") {
    redirect("/admin/dashboard");
  }

  return (
    <div className="py-6 sm:py-12 px-3 sm:px-6 lg:px-8">
      <AdminLoginForm />
    </div>
  );
}
