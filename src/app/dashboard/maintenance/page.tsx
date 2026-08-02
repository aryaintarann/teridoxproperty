"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { getMaintenance } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { MaterialIcon } from "@/components/ui/material-icon";
import { gooeyToast } from "goey-toast";
import { useState, useEffect } from "react";
import { markMaintenanceResolved } from "@/lib/api";

export default function MaintenancePage() {
  const [mockMaintenance, setMockMaintenance] = useState<any[]>([]);

  const fetchMaintenance = () => {
    getMaintenance().then(setMockMaintenance);
  };

  useEffect(() => {
    fetchMaintenance();
  }, []);

  const handleResolve = async (id: string) => {
    try {
      await markMaintenanceResolved(id);
      gooeyToast.success("Ticket marked as resolved");
      fetchMaintenance();
    } catch (error) {
      gooeyToast.error("Failed to resolve ticket");
    }
  };
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Maintenance Requests</h1>
          <p className="text-muted-foreground mt-1">Track and resolve issues reported by tenants.</p>
        </div>
        <Button onClick={() => gooeyToast.success("Simulated submitting new request")}>
          <MaterialIcon name="build" className="mr-2" /> New Request
        </Button>
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Ticket Board</CardTitle>
          <CardDescription>All pending and resolved maintenance tickets.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs uppercase bg-muted/50 text-muted-foreground">
                <tr>
                  <th className="px-6 py-3 rounded-tl-lg">Ticket ID</th>
                  <th className="px-6 py-3">Unit</th>
                  <th className="px-6 py-3">Reported By</th>
                  <th className="px-6 py-3">Issue</th>
                  <th className="px-6 py-3">Priority</th>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 rounded-tr-lg">Actions</th>
                </tr>
              </thead>
              <tbody>
                {mockMaintenance.map((ticket) => (
                  <tr key={ticket.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                    <td className="px-6 py-4 font-medium text-muted-foreground">{ticket.id}</td>
                    <td className="px-6 py-4 font-bold text-foreground">{ticket.unit}</td>
                    <td className="px-6 py-4">{ticket.reportedBy}</td>
                    <td className="px-6 py-4 font-medium">{ticket.issue}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-[10px] font-bold tracking-wider uppercase
                        ${ticket.priority === 'High' ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-400' : ''}
                        ${ticket.priority === 'Medium' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-400' : ''}
                        ${ticket.priority === 'Low' ? 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400' : ''}
                      `}>
                        {ticket.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4">{ticket.date}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold tracking-wide border
                        ${ticket.status === 'Resolved' ? 'bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-900/20 dark:border-emerald-800 dark:text-emerald-400' : ''}
                        ${ticket.status === 'In Progress' ? 'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-400' : ''}
                        ${ticket.status === 'New' ? 'bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-900/20 dark:border-amber-800 dark:text-amber-400' : ''}
                      `}>
                        {ticket.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {ticket.status !== 'Resolved' && (
                        <Button variant="outline" size="sm" onClick={() => handleResolve(ticket.id)}>
                          <MaterialIcon name="check_circle" className="mr-1 text-emerald-500" /> Resolve
                        </Button>
                      )}
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
