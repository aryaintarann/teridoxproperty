"use client";

import { Building, Users, FileText, CreditCard, Settings, LogOut, LayoutDashboard, Wrench } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MaterialIcon } from "@/components/ui/material-icon";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<{name: string, role: string} | null>(null);

  useEffect(() => {
    const session = localStorage.getItem("teridox_session");
    if (!session) {
      router.push("/login");
    } else {
      setUser(JSON.parse(session));
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("teridox_session");
    router.push("/login");
  };

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Properties & Units", href: "/dashboard/properties", icon: Building },
    { name: "Tenants", href: "/dashboard/tenants", icon: Users },
    { name: "Contracts", href: "/dashboard/contracts", icon: FileText },
    { name: "Billing", href: "/dashboard/billing", icon: CreditCard },
    { name: "Maintenance", href: "/dashboard/maintenance", icon: Wrench },
  ];

  if (!user) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-background">
        <MaterialIcon name="sync" className="animate-spin text-4xl text-primary" />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-slate-200 dark:border-slate-800">
          <Link href="/" className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            TeridoxProperty
          </Link>
        </div>
        
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {navItems.map((item) => (
            <Link key={item.name} href={item.href}>
              <Button variant="ghost" className="w-full justify-start text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20">
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </Button>
            </Link>
          ))}
        </div>

        <div className="p-4 border-t border-slate-200 dark:border-slate-800">
          <Button variant="ghost" className="w-full justify-start text-slate-600 dark:text-slate-400">
            <Settings className="mr-3 h-5 w-5" />
            Settings
          </Button>
          <Button variant="ghost" onClick={handleLogout} className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/50 mt-1">
            <LogOut className="mr-3 h-5 w-5" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-8">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
            {user.role === 'admin' ? 'Admin Dashboard' : 'Tenant Portal'}
          </h2>
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-end mr-2">
              <span className="text-sm font-bold leading-none">{user.name}</span>
              <span className="text-xs text-muted-foreground capitalize">{user.role}</span>
            </div>
            <div className="w-10 h-10 bg-primary/10 text-primary rounded-full flex items-center justify-center font-bold">
              {user.name.substring(0, 2).toUpperCase()}
            </div>
          </div>
        </header>
        <div className="flex-1 overflow-auto p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
