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
      <div className="space-y-8 animate-in fade-in duration-700 slide-in-from-bottom-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-indigo-500 bg-clip-text text-transparent">
              Dashboard Overview
            </h1>
            <p className="text-muted-foreground mt-2 text-lg">Welcome back, <span className="font-medium text-foreground">{user.name}</span>!</p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="group hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1 transition-all duration-300 border-border/50 bg-background/50 backdrop-blur-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Units</CardTitle>
              <div className="bg-primary/10 p-2.5 rounded-xl group-hover:scale-110 transition-transform duration-300">
                <Building className="h-5 w-5 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black">{tenantStats.totalUnits}</div>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg hover:shadow-indigo-500/5 hover:-translate-y-1 transition-all duration-300 border-border/50 bg-background/50 backdrop-blur-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Active Tenants</CardTitle>
              <div className="bg-indigo-500/10 p-2.5 rounded-xl group-hover:scale-110 transition-transform duration-300">
                <Users className="h-5 w-5 text-indigo-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black">{tenantStats.activeTenants}</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
          {/* Contracts */}
          <Card className="shadow-sm flex flex-col border-border/50 bg-background/50 backdrop-blur-xl hover:shadow-md transition-all duration-300">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-lg">
                <div className="bg-emerald-500/10 p-2 rounded-lg">
                  <Gavel className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                My Contracts
              </CardTitle>
              <CardDescription className="text-sm">Active & Expiring Soon</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="space-y-3">
                {tenantContracts.map((item, i) => (
                  <div key={i} className="group flex items-center justify-between p-3.5 border border-slate-100 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:border-emerald-200 dark:hover:border-emerald-900/50 transition-all cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="w-1.5 h-8 rounded-full bg-emerald-500/50 group-hover:bg-emerald-500 transition-colors"></div>
                      <div className="font-semibold text-sm">{item.unit}</div>
                    </div>
                    <div className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${item.status === 'Expiring Soon' ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-400' : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400'}`}>
                      {item.end_date}
                    </div>
                  </div>
                ))}
                {tenantContracts.length === 0 && <p className="text-sm text-muted-foreground text-center py-6 border border-dashed rounded-xl border-slate-200 dark:border-slate-800">No contracts found.</p>}
              </div>
            </CardContent>
          </Card>

          {/* Recent Maintenance */}
          <Card className="shadow-sm flex flex-col border-border/50 bg-background/50 backdrop-blur-xl hover:shadow-md transition-all duration-300">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-lg">
                <div className="bg-amber-500/10 p-2 rounded-lg">
                  <PenTool className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                </div>
                Recent Maintenance
              </CardTitle>
              <CardDescription className="text-sm">Latest reported issues</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="space-y-3">
                {recentMaintenance.map((item, i) => (
                  <div key={i} className="group flex items-center justify-between p-3.5 border border-slate-100 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:border-amber-200 dark:hover:border-amber-900/50 transition-all cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="w-1.5 h-8 rounded-full bg-amber-500/50 group-hover:bg-amber-500 transition-colors"></div>
                      <div>
                        <div className="font-semibold text-sm">{item.unit}</div>
                        <div className="text-[11px] text-muted-foreground line-clamp-1">{item.issue}</div>
                      </div>
                    </div>
                    <div className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${item.status === 'Resolved' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400'}`}>
                      {item.status}
                    </div>
                  </div>
                ))}
                {recentMaintenance.length === 0 && <p className="text-sm text-muted-foreground text-center py-6 border border-dashed rounded-xl border-slate-200 dark:border-slate-800">No maintenance activity.</p>}
              </div>
            </CardContent>
          </Card>

          {/* Recent Billing */}
          <Card className="shadow-sm flex flex-col border-border/50 bg-background/50 backdrop-blur-xl hover:shadow-md transition-all duration-300">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-lg">
                <div className="bg-blue-500/10 p-2 rounded-lg">
                  <Receipt className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                Recent Billing
              </CardTitle>
              <CardDescription className="text-sm">Latest generated invoices</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="space-y-3">
                {recentBilling.map((item, i) => (
                  <div key={i} className="group flex flex-col justify-center p-3.5 border border-slate-100 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:border-blue-200 dark:hover:border-blue-900/50 transition-all cursor-pointer gap-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-4 rounded-full bg-blue-500/50 group-hover:bg-blue-500 transition-colors"></div>
                        <span className="font-semibold text-sm">{item.unit}</span>
                      </div>
                      <div className="text-sm font-bold text-foreground">{item.amount}</div>
                    </div>
                    <div className="flex justify-between items-center pl-3.5">
                      <div className="text-[11px] text-muted-foreground font-medium">{item.type}</div>
                      <div className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider 
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
                {recentBilling.length === 0 && <p className="text-sm text-muted-foreground text-center py-6 border border-dashed rounded-xl border-slate-200 dark:border-slate-800">No billing activity.</p>}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // --- ADMIN DASHBOARD RENDER ---
  return (
    <div className="space-y-8 animate-in fade-in duration-700 slide-in-from-bottom-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-indigo-500 bg-clip-text text-transparent">
            Dashboard Overview
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">Here is what is happening with your properties today.</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="group hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1 transition-all duration-300 border-border/50 bg-background/50 backdrop-blur-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Properties</CardTitle>
            <div className="bg-primary/10 p-2.5 rounded-xl group-hover:scale-110 transition-transform duration-300">
              <Building className="h-5 w-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black">{adminStats.totalProperties} <span className="text-lg font-medium text-muted-foreground">units</span></div>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg hover:shadow-indigo-500/5 hover:-translate-y-1 transition-all duration-300 border-border/50 bg-background/50 backdrop-blur-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Tenants</CardTitle>
            <div className="bg-indigo-500/10 p-2.5 rounded-xl group-hover:scale-110 transition-transform duration-300">
              <Users className="h-5 w-5 text-indigo-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black">{adminStats.activeTenants}</div>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg hover:shadow-emerald-500/5 hover:-translate-y-1 transition-all duration-300 border-border/50 bg-background/50 backdrop-blur-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Monthly Revenue</CardTitle>
            <div className="bg-emerald-500/10 p-2.5 rounded-xl group-hover:scale-110 transition-transform duration-300">
              <CreditCard className="h-5 w-5 text-emerald-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black">{formatRupiah(adminStats.monthlyRevenue)}</div>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg hover:shadow-rose-500/5 hover:-translate-y-1 transition-all duration-300 border-border/50 bg-background/50 backdrop-blur-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Actions</CardTitle>
            <div className="bg-rose-500/10 p-2.5 rounded-xl group-hover:scale-110 transition-transform duration-300">
              <AlertCircle className="h-5 w-5 text-rose-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black">{adminStats.pendingActions}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 shadow-sm border-border/50 bg-background/50 backdrop-blur-xl hover:shadow-md transition-all duration-300">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl">Recent Activity</CardTitle>
            <CardDescription>Latest updates across your properties</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {recentActivity.map((item, i) => (
                <div key={i} className="flex items-center group">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary/20 to-indigo-500/20 flex items-center justify-center font-bold text-sm text-primary group-hover:scale-110 transition-transform duration-300 ring-2 ring-background">
                    {item.name.charAt(0)}
                  </div>
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-semibold leading-none">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{item.action}</p>
                  </div>
                  {item.amount && (
                    <div className="ml-auto font-bold text-sm bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2.5 py-1 rounded-md">
                      {item.amount}
                    </div>
                  )}
                </div>
              ))}
              {recentActivity.length === 0 && <p className="text-sm text-muted-foreground text-center py-6 border border-dashed rounded-xl border-slate-200 dark:border-slate-800">No recent activity.</p>}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3 shadow-sm border-border/50 bg-background/50 backdrop-blur-xl hover:shadow-md transition-all duration-300">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl text-rose-600 dark:text-rose-400 flex items-center gap-2">
              <AlertCircle className="h-5 w-5" /> Expiring Contracts
            </CardTitle>
            <CardDescription>Needs attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {adminContracts.map((item, i) => (
                <div key={i} className="group flex items-center justify-between p-3.5 border border-slate-100 dark:border-slate-800 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-900/10 hover:border-rose-200 dark:hover:border-rose-900/50 transition-all cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-10 rounded-full bg-rose-500/30 group-hover:bg-rose-500 transition-colors"></div>
                    <div>
                      <div className="font-bold text-sm">{item.unit}</div>
                      <div className="text-xs text-muted-foreground font-medium">{item.tenant_name}</div>
                    </div>
                  </div>
                  <div className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${item.status === 'Expiring Soon' ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-400' : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400'}`}>
                    {item.end_date}
                  </div>
                </div>
              ))}
              {adminContracts.length === 0 && <p className="text-sm text-muted-foreground text-center py-6 border border-dashed rounded-xl border-slate-200 dark:border-slate-800">No expiring contracts.</p>}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
