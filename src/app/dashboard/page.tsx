"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Building, Users, CreditCard, TrendingUp, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { getUnits, getTenants, getBilling, getContracts, getMaintenance } from "@/lib/api";

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalProperties: 0,
    activeTenants: 0,
    monthlyRevenue: 0,
    pendingActions: 0,
  });
  const [contracts, setContracts] = useState<any[]>([]);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const [units, tenants, billing, allContracts, maintenance] = await Promise.all([
        getUnits(),
        getTenants(),
        getBilling(),
        getContracts(),
        getMaintenance()
      ]);

      const activeTenants = tenants.filter(t => t.status === 'Active').length;
      
      const monthlyRevenue = billing
        .filter(b => b.status === 'Paid')
        .reduce((sum, b) => {
          const num = parseInt(b.amount.replace(/[^0-9]/g, '')) || 0;
          return sum + num;
        }, 0);
      
      const pendingMaintenance = maintenance.filter(m => m.status !== 'Resolved').length;
      const overdueBilling = billing.filter(b => b.status === 'Overdue').length;

      setStats({
        totalProperties: units.length,
        activeTenants,
        monthlyRevenue,
        pendingActions: pendingMaintenance + overdueBilling,
      });

      setContracts(allContracts.filter(c => c.status === 'Expiring Soon' || c.status === 'Active').slice(0, 5));

      const activity = [
        ...billing.map(b => ({ name: b.tenant_name, action: `Billed for ${b.type}`, time: b.due_date, amount: b.amount })),
        ...maintenance.map(m => ({ name: m.reported_by, action: `Reported: ${m.issue}`, time: m.date, amount: '' }))
      ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 5);

      setRecentActivity(activity);
      setIsLoading(false);
    }
    loadData();
  }, []);

  if (isLoading) return <div className="p-8 text-center">Loading dashboard analytics...</div>;

  const formatRupiah = (num: number) => {
    if (num >= 1000000) return `Rp ${(num / 1000000).toFixed(1)}M`;
    return `Rp ${num.toLocaleString('id-ID')}`;
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
        <p className="text-muted-foreground mt-1">Here is what is happening with your properties today.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:border-primary/50 transition-colors shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Properties</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProperties} units</div>
          </CardContent>
        </Card>

        <Card className="hover:border-indigo-500/50 transition-colors shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Tenants</CardTitle>
            <Users className="h-4 w-4 text-indigo-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeTenants}</div>
          </CardContent>
        </Card>

        <Card className="hover:border-emerald-500/50 transition-colors shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <CreditCard className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatRupiah(stats.monthlyRevenue)}</div>
          </CardContent>
        </Card>

        <Card className="hover:border-rose-500/50 transition-colors shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Actions</CardTitle>
            <AlertCircle className="h-4 w-4 text-rose-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingActions}</div>
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
            <div className="space-y-8">
              {recentActivity.map((item, i) => (
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
                      {item.amount}
                    </div>
                  )}
                </div>
              ))}
              {recentActivity.length === 0 && <p className="text-muted-foreground">No recent activity.</p>}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3 shadow-sm">
          <CardHeader>
            <CardTitle>Expiring Contracts</CardTitle>
            <CardDescription>Needs attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {contracts.map((item, i) => (
                <div key={i} className="flex items-center justify-between p-4 border border-slate-100 dark:border-slate-800 rounded-lg">
                  <div>
                    <div className="font-semibold">{item.unit}</div>
                    <div className="text-sm text-muted-foreground">{item.tenant_name}</div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${item.status === 'Expiring Soon' ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-400' : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400'}`}>
                    {item.end_date}
                  </div>
                </div>
              ))}
              {contracts.length === 0 && <p className="text-muted-foreground">No contracts found.</p>}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
