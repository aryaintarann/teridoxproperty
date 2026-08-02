"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { mockTenants } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { MaterialIcon } from "@/components/ui/material-icon";
import { gooeyToast } from "goey-toast";
import { useState } from "react";
import { Input } from "@/components/ui/input";

export default function TenantsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTenants = mockTenants.filter(tenant => 
    tenant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tenant.unit.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tenants</h1>
          <p className="text-muted-foreground mt-1">Manage tenant profiles and communications.</p>
        </div>
        <Button onClick={() => gooeyToast.success("Simulated adding new tenant")}>
          <MaterialIcon name="person_add" className="mr-2" /> Add Tenant
        </Button>
      </div>

      <Card className="shadow-sm">
        <CardHeader className="flex flex-col sm:flex-row justify-between sm:items-center space-y-4 sm:space-y-0">
          <div>
            <CardTitle>Tenant Directory</CardTitle>
            <CardDescription>All active and past tenants.</CardDescription>
          </div>
          <div className="relative w-full sm:w-64">
            <MaterialIcon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm" />
            <Input 
              placeholder="Search tenants..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs uppercase bg-muted/50 text-muted-foreground">
                <tr>
                  <th className="px-6 py-3 rounded-tl-lg">ID</th>
                  <th className="px-6 py-3">Name</th>
                  <th className="px-6 py-3">Unit</th>
                  <th className="px-6 py-3">Contact</th>
                  <th className="px-6 py-3">Joined Date</th>
                  <th className="px-6 py-3 rounded-tr-lg">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredTenants.map((tenant) => (
                  <tr key={tenant.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                    <td className="px-6 py-4 font-medium text-muted-foreground">{tenant.id}</td>
                    <td className="px-6 py-4 font-bold text-foreground">{tenant.name}</td>
                    <td className="px-6 py-4">{tenant.unit}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span>{tenant.email}</span>
                        <span className="text-xs text-muted-foreground">{tenant.phone}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">{tenant.joinedAt}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold tracking-wide ${tenant.status === 'Active' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400'}`}>
                        {tenant.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {filteredTenants.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">No tenants found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
