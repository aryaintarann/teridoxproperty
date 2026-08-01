"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Building, Users, CreditCard, TrendingUp, AlertCircle } from "lucide-react";
import { gooeyToast } from "goey-toast";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const handleTestToast = () => {
    gooeyToast.success("Dashboard successfully loaded!", {
      description: "Welcome back to TeridoxProperty.",
    });
  };

  const handleTestError = () => {
    gooeyToast.warning("Pending Maintenance", {
      description: "Unit A-102 reported a leaking AC.",
      action: {
        label: "View",
        onClick: () => gooeyToast.success("Navigating to maintenance...")
      }
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Welcome back. Here is what's happening with your properties today.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleTestError}>Test Alert</Button>
          <Button onClick={handleTestToast}>Welcome Toast</Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:border-blue-500/50 transition-colors shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Properties</CardTitle>
            <Building className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground mt-1">
              45 total units across properties
            </p>
          </CardContent>
        </Card>

        <Card className="hover:border-indigo-500/50 transition-colors shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Tenants</CardTitle>
            <Users className="h-4 w-4 text-indigo-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">42</div>
            <p className="text-xs text-muted-foreground mt-1 text-emerald-500 flex items-center">
              <TrendingUp className="w-3 h-3 mr-1" /> +3 this month
            </p>
          </CardContent>
        </Card>

        <Card className="hover:border-emerald-500/50 transition-colors shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <CreditCard className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Rp 64.5M</div>
            <p className="text-xs text-muted-foreground mt-1">
              92% collection rate
            </p>
          </CardContent>
        </Card>

        <Card className="hover:border-rose-500/50 transition-colors shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Actions</CardTitle>
            <AlertCircle className="h-4 w-4 text-rose-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground mt-1 text-rose-500">
              2 maintenance, 3 late payments
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 shadow-sm">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest updates across your properties</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Phantom UI Wrapper for mock loading state */}
            <phantom-ui loading={false} animation="pulse" reveal={0.2}>
              <div className="space-y-8">
                {[
                  { name: "Budi Santoso", action: "Paid rent for Unit A-101", time: "2 hours ago", amount: "Rp 1.500.000" },
                  { name: "Siti Aminah", action: "Submitted maintenance request", time: "5 hours ago", amount: "" },
                  { name: "Andi Wijaya", action: "Signed new contract for Unit B-205", time: "Yesterday", amount: "" },
                  { name: "Reza Rahadian", action: "Paid rent for Unit A-105", time: "Yesterday", amount: "Rp 1.500.000" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center">
                    <div className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-medium text-sm">
                      {item.name.charAt(0)}
                    </div>
                    <div className="ml-4 space-y-1">
                      <p className="text-sm font-medium leading-none">{item.name}</p>
                      <p className="text-sm text-muted-foreground">{item.action}</p>
                    </div>
                    {item.amount && (
                      <div className="ml-auto font-medium text-emerald-600 dark:text-emerald-400">
                        +{item.amount}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </phantom-ui>
          </CardContent>
        </Card>

        <Card className="col-span-3 shadow-sm">
          <CardHeader>
            <CardTitle>Expiring Contracts</CardTitle>
            <CardDescription>Needs attention in next 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { unit: "A-102", tenant: "Diana Putri", days: 5 },
                { unit: "B-105", tenant: "Kevin", days: 12 },
                { unit: "A-201", tenant: "Sarah", days: 28 },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-4 border border-slate-100 dark:border-slate-800 rounded-lg">
                  <div>
                    <div className="font-semibold">{item.unit}</div>
                    <div className="text-sm text-muted-foreground">{item.tenant}</div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${item.days < 7 ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400'}`}>
                    {item.days} days left
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
