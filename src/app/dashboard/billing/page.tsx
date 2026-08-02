"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { getBilling } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { MaterialIcon } from "@/components/ui/material-icon";
import { gooeyToast } from "goey-toast";
import { useState, useEffect } from "react";
import { markInvoicePaid } from "@/lib/api";

export default function BillingPage() {
  const [mockBilling, setMockBilling] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);

  const fetchBilling = () => {
    const session = localStorage.getItem("teridox_session");
    let tenantName = undefined;
    if (session) {
      const parsed = JSON.parse(session);
      setUser(parsed);
      if (parsed.role === 'tenant') {
        tenantName = parsed.name;
      }
    }
    getBilling(tenantName).then(setMockBilling);
  };

  useEffect(() => {
    fetchBilling();
  }, []);

  const handleMarkPaid = async (id: string) => {
    try {
      await markInvoicePaid(id);
      gooeyToast.success("Invoice marked as paid");
      fetchBilling();
    } catch (error) {
      gooeyToast.error("Failed to mark invoice as paid");
    }
  };

  const calculateTotal = (status: string) => {
    return mockBilling
      .filter(b => status === 'All' || b.status === status)
      .reduce((sum, b) => sum + (parseInt(b.amount.replace(/[^0-9]/g, '')) || 0), 0);
  };

  const formatRupiah = (num: number) => `Rp ${num.toLocaleString('id-ID')}`;
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Billing & Invoices</h1>
          <p className="text-muted-foreground mt-1">Manage rent, utilities, and payment status.</p>
        </div>
        {user?.role === 'admin' && (
          <Button onClick={() => gooeyToast.success("Simulated generating new invoice")}>
            <MaterialIcon name="receipt" className="mr-2" /> Generate Invoice
          </Button>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-3 mb-8">
        <Card className="bg-primary text-primary-foreground">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium opacity-90">Total Collected</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatRupiah(calculateTotal('Paid'))}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">{formatRupiah(calculateTotal('Pending'))}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Overdue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-rose-600">{formatRupiah(calculateTotal('Overdue'))}</div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Recent Invoices</CardTitle>
          <CardDescription>Track the latest billing activities.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs uppercase bg-muted/50 text-muted-foreground">
                <tr>
                  <th className="px-6 py-3 rounded-tl-lg">Invoice ID</th>
                  <th className="px-6 py-3">Tenant & Unit</th>
                  <th className="px-6 py-3">Type</th>
                  <th className="px-6 py-3">Amount</th>
                  <th className="px-6 py-3">Due Date</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 rounded-tr-lg">Actions</th>
                </tr>
              </thead>
              <tbody>
                {mockBilling.map((invoice) => (
                  <tr key={invoice.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                    <td className="px-6 py-4 font-medium text-muted-foreground">{invoice.id}</td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-foreground">{invoice.tenantName}</div>
                      <div className="text-xs text-muted-foreground">Unit: {invoice.unit}</div>
                    </td>
                    <td className="px-6 py-4">{invoice.type}</td>
                    <td className="px-6 py-4 font-bold">{invoice.amount}</td>
                    <td className="px-6 py-4">{invoice.dueDate}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold tracking-wide 
                        ${invoice.status === 'Paid' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : ''}
                        ${invoice.status === 'Pending' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' : ''}
                        ${invoice.status === 'Overdue' ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400' : ''}
                      `}>
                        {invoice.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {invoice.status !== 'Paid' && (
                        <Button variant="outline" size="sm" onClick={() => handleMarkPaid(invoice.id)}>
                          <MaterialIcon name="payment" className="mr-1 text-emerald-500" /> Mark Paid
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
