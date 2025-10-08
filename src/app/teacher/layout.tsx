import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ListChecks, PlusCircle, LayoutDashboard, User } from "lucide-react";

const teacherNavLinks = [
  { href: "/teacher", label: "Dashboard", icon: LayoutDashboard },
  { href: "/teacher/submissions", label: "Submissions", icon: ListChecks },
  { href: "/teacher/tasks", label: "Task Management", icon: PlusCircle },
  { href: "/teacher/profile", label: "Profile", icon: User },
];

export default function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="bg-secondary border-b">
        <div className="container mx-auto p-4 flex flex-col md:flex-row items-center justify-between">
            <div className="mb-4 md:mb-0">
                <h2 className="text-2xl font-bold flex items-center gap-2"><LayoutDashboard /> Teacher Dashboard</h2>
                <p className="text-muted-foreground">Manage tasks and review student submissions.</p>
            </div>
            <nav className="flex items-center gap-2">
                {teacherNavLinks.map(link => {
                    const Icon = link.icon;
                    return (
                        <Button asChild variant="outline" key={link.href}>
                            <Link href={link.href} className="flex items-center gap-2">
                                <Icon className="w-4 h-4" />
                                <span className="hidden sm:inline">{link.label}</span>
                            </Link>
                        </Button>
                    );
                })}
                 <Button asChild variant="secondary" size="sm">
                  <Link href="/">Switch Role</Link>
                </Button>
            </nav>
        </div>
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}
