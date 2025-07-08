import { Sidebar } from "@/components/dashboard/Sidebar";
import { getSession } from "@/lib/auth";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <Sidebar session={session} />
      <main className="flex-1 p-8 bg-secondary/50">
        {children}
      </main>
    </div>
  );
}
