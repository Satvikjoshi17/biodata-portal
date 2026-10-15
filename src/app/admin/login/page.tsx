import { AdminLoginForm } from "@/components/AdminLoginForm";

export const metadata = {
  title: "Admin Login | Samaj Biodata Portal",
};

export default function AdminLoginPage() {
  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <AdminLoginForm />
    </div>
  );
}
