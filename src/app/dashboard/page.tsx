"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Building, Users, CreditCard, AlertCircle, Receipt, PenTool, Gavel } from "lucide-react";
import { useState, useEffect } from "react";
import { getUnits, getTenants, getBilling, getContracts, getMaintenance } from "@/lib/api";

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  
  // Admin States
  const [adminStats, setAdminStats] = useState({
    totalProperties: 0,
    activeTenants: 0,
    monthlyRevenue: 0,
    pendingActions: 0,
  });
  const [adminContracts, setAdminContracts] = useState<any[]>([]);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  
  // Tenant (User) States
  const [tenantStats, setTenantStats] = useState({
    totalUnits: 0,
    activeTenants: 0,
  });
  const [tenantContracts, setTenantContracts] = useState<any[]>([]);
  const [recentMaintenance, setRecentMaintenance] = useState<any[]>([]);
  const [recentBilling, setRecentBilling] = useState<any[]>([]);
  
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const session = localStorage.getItem("teridox_session");
      let currentUser = null;
      let tenantName = undefined;
      if (session) {
        currentUser = JSON.parse(session);
        setUser(currentUser);
        if (currentUser.role === 'tenant') {
          tenantName = currentUser.name;
        }
      }

      // Fetch data (filtered if tenantName is provided)
      const [units, tenants, billing, allContracts, maintenance] = await Promise.all([
        getUnits(),
        getTenants(),
        getBilling(tenantName),
        getContracts(tenantName),
        getMaintenance(tenantName)
      ]);

      const totalActive = tenants.filter(t => t.status === 'Active').length;

      if (currentUser?.role === 'admin') {
        const monthlyRevenue = billing
          .filter(b => b.status === 'Paid')
          .reduce((sum, b) => {
            const num = parseInt(b.amount.replace(/[^0-9]/g, '')) || 0;
            return sum + num;
          }, 0);
        
        const pendingMaintenance = maintenance.filter(m => m.status !== 'Resolved').length;
        const overdueBilling = billing.filter(b => b.status === 'Overdue').length;

        setAdminStats({
          totalProperties: units.length,
          activeTenants: totalActive,
          monthlyRevenue,
          pendingActions: pendingMaintenance + overdueBilling,
        });

        setAdminContracts(allContracts.filter(c => c.status === 'Expiring Soon' || c.status === 'Active').slice(0, 5));

        const activity = [
          ...billing.map(b => ({ name: b.tenant_name, action: `Billed for ${b.type}`, time: b.due_date, amount: b.amount })),
          ...maintenance.map(m => ({ name: m.reported_by, action: `Reported: ${m.issue}`, time: m.date, amount: '' }))
        ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 5);
        setRecentActivity(activity);

      } else {
        // Tenant (User) Dashboard Data
        // User requested to see "total unit" and "total active tenant"
        setTenantStats({
          totalUnits: units.length, // Or could be allContracts.length for their own units
          activeTenants: totalActive,
        });

        setTenantContracts(allContracts.filter(c => c.status === 'Expiring Soon' || c.status === 'Active').slice(0, 5));
        setRecentBilling(billing.sort((a, b) => new Date(b.due_date).getTime() - new Date(a.due_date).getTime()).slice(0, 5));
        setRecentMaintenance(maintenance.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5));
      }

      setIsLoading(false);
    }
    loadData();
  }, []);

  const formatRupiah = (num: number) => {
    if (num >= 1000000) return `Rp ${(num / 1000000).toFixed(1)}M`;
    return `Rp ${num.toLocaleString('id-ID')}`;
  };

  if (isLoading) return <div className="p-8 text-center text-muted-foreground animate-pulse">Loading dashboard analytics...</div>;

  // --- TENANT (USER) DASHBOARD RENDER ---
  if (user?.role === 'tenant') {
    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
          <p className="text-muted-foreground mt-1">Welcome back, {user.name}!</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card className="hover:border-primary/50 transition-colors shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Units</CardTitle>
              <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{tenantStats.totalUnits}</div>
            </CardContent>
          </Card>

          <Card className="hover:border-indigo-500/50 transition-colors shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Active Tenants</CardTitle>
              <Users className="h-4 w-4 text-indigo-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{tenantStats.activeTenants}</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
          {/* Contracts */}
          <Card className="shadow-sm flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gavel className="h-5 w-5 text-emerald-600" /> My Contracts
              </CardTitle>
              <CardDescription>Active & Expiring Soon</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="space-y-4">
                {tenantContracts.map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-3 border border-slate-100 dark:border-slate-800 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <div>
                      <div className="font-semibold text-sm">{item.unit}</div>
                    </div>
                    <div className={`px-2 py-1 rounded text-[10px] font-medium ${item.status === 'Expiring Soon' ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-400' : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400'}`}>
                      {item.end_date}
                    </div>
                  </div>
                ))}
                {tenantContracts.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">No contracts found.</p>}
              </div>
            </CardContent>
          </Card>

          {/* Recent Maintenance */}
          <Card className="shadow-sm flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PenTool className="h-5 w-5 text-amber-600" /> Recent Maintenance
              </CardTitle>
              <CardDescription>Latest reported issues</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="space-y-4">
                {recentMaintenance.map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-3 border border-slate-100 dark:border-slate-800 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <div>
                      <div className="font-semibold text-sm">{item.unit}</div>
                      <div className="text-xs text-muted-foreground line-clamp-1">{item.issue}</div>
                    </div>
                    <div className={`px-2 py-1 rounded text-[10px] font-medium ${item.status === 'Resolved' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400'}`}>
                      {item.status}
                    </div>
                  </div>
                ))}
                {recentMaintenance.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">No maintenance activity.</p>}
              </div>
            </CardContent>
          </Card>

          {/* Recent Billing */}
          <Card className="shadow-sm flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Receipt className="h-5 w-5 text-blue-600" /> Recent Billing
              </CardTitle>
              <CardDescription>Latest generated invoices</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="space-y-4">
                {recentBilling.map((item, i) => (
                  <div key={i} className="flex flex-col justify-center p-3 border border-slate-100 dark:border-slate-800 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors gap-1">
                    <div className="flex justify-between items-center">
                      <div className="font-semibold text-sm">{item.unit}</div>
                      <div className="text-xs font-bold text-foreground">{item.amount}</div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="text-xs text-muted-foreground">{item.type}</div>
                      <div className={`px-2 py-0.5 rounded text-[10px] font-medium 
                        ${item.status === 'Paid' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : ''}
                        ${item.status === 'Pending' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' : ''}
                        ${item.status === 'Pending Verification' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : ''}
                        ${item.status === 'Overdue' ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400' : ''}
                      `}>
                        {item.status}
                      </div>
                    </div>
                  </div>
                ))}
                {recentBilling.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">No billing activity.</p>}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // --- ADMIN DASHBOARD RENDER ---
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
            <div className="text-2xl font-bold">{adminStats.totalProperties} units</div>
          </CardContent>
        </Card>

        <Card className="hover:border-indigo-500/50 transition-colors shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Tenants</CardTitle>
            <Users className="h-4 w-4 text-indigo-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{adminStats.activeTenants}</div>
          </CardContent>
        </Card>

        <Card className="hover:border-emerald-500/50 transition-colors shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <CreditCard className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatRupiah(adminStats.monthlyRevenue)}</div>
          </CardContent>
        </Card>

        <Card className="hover:border-rose-500/50 transition-colors shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Actions</CardTitle>
            <AlertCircle className="h-4 w-4 text-rose-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{adminStats.pendingActions}</div>
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
              {adminContracts.map((item, i) => (
                <div key={i} className="flex items-center justify-between p-4 border border-slate-100 dark:border-slate-800 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <div>
                    <div className="font-semibold">{item.unit}</div>
                    <div className="text-sm text-muted-foreground">{item.tenant_name}</div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${item.status === 'Expiring Soon' ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-400' : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400'}`}>
                    {item.end_date}
                  </div>
                </div>
              ))}
              {adminContracts.length === 0 && <p className="text-muted-foreground">No contracts found.</p>}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
