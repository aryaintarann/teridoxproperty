"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { mockContracts } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { MaterialIcon } from "@/components/ui/material-icon";
import { gooeyToast } from "goey-toast";

export default function ContractsPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Contracts</h1>
          <p className="text-muted-foreground mt-1">Manage lease agreements and renewals.</p>
        </div>
        <Button onClick={() => gooeyToast.success("Simulated drafting new contract")}>
          <MaterialIcon name="description" className="mr-2" /> Draft Contract
        </Button>
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Active & Past Contracts</CardTitle>
          <CardDescription>View all agreements, including expiring ones.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs uppercase bg-muted/50 text-muted-foreground">
                <tr>
                  <th className="px-6 py-3 rounded-tl-lg">Contract ID</th>
                  <th className="px-6 py-3">Tenant Name</th>
                  <th className="px-6 py-3">Unit</th>
                  <th className="px-6 py-3">Duration</th>
                  <th className="px-6 py-3 rounded-tr-lg">Status</th>
                </tr>
              </thead>
              <tbody>
                {mockContracts.map((contract) => (
                  <tr key={contract.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                    <td className="px-6 py-4 font-medium text-primary hover:underline cursor-pointer">{contract.id}</td>
                    <td className="px-6 py-4 font-bold text-foreground">{contract.tenantName}</td>
                    <td className="px-6 py-4">{contract.unit}</td>
                    <td className="px-6 py-4">
                      {contract.startDate} - {contract.endDate}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold tracking-wide 
                        ${contract.status === 'Active' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : ''}
                        ${contract.status === 'Expiring Soon' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' : ''}
                        ${contract.status === 'Expired' ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400' : ''}
                      `}>
                        {contract.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
