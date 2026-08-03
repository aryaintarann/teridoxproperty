"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { getBilling, getTenants, getUnits, getContracts, addBilling, deleteBilling, submitPaymentProof, markInvoicePaid } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { MaterialIcon } from "@/components/ui/material-icon";
import { gooeyToast } from "goey-toast";
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { InvoicePreviewModal, printInvoice } from "@/components/dashboard/InvoicePreviewModal";

export default function BillingPage() {
  const [mockBilling, setMockBilling] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);

  // Form dependencies (Admin only)
  const [availableTenants, setAvailableTenants] = useState<any[]>([]);
  const [availableUnits, setAvailableUnits] = useState<any[]>([]);
  const [activeContracts, setActiveContracts] = useState<any[]>([]);

  // Modals state
  const [isGenerateOpen, setIsGenerateOpen] = useState(false);
  const [invoiceToView, setInvoiceToView] = useState<any>(null);
  const [invoiceToPay, setInvoiceToPay] = useState<any>(null);
  const [invoiceToReview, setInvoiceToReview] = useState<any>(null);
  const [invoiceToDelete, setInvoiceToDelete] = useState<any>(null);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [proofUrl, setProofUrl] = useState("");

  const [formData, setFormData] = useState({
    tenant_name: "",
    unit: "",
    type: "Rent",
    amount: "",
    due_date: "",
    status: "Pending"
  });

  const fetchBilling = async (tenantName?: string) => {
    const data = await getBilling(tenantName);
    setMockBilling(data);
  };

  useEffect(() => {
    const initializeData = async () => {
      const session = localStorage.getItem("teridox_session");
      let tenantName = undefined;
      if (session) {
        const parsed = JSON.parse(session);
        setUser(parsed);
        if (parsed.role === 'tenant') {
          tenantName = parsed.name;
        } else if (parsed.role === 'admin') {
          const [tenants, units, contracts] = await Promise.all([getTenants(), getUnits(), getContracts()]);
          setAvailableTenants(tenants);
          setAvailableUnits(units);
          setActiveContracts(contracts);
        }
      }
      fetchBilling(tenantName);
    };
    initializeData();
  }, []);

  const calculateTotal = (status: string) => {
    return mockBilling
      .filter(b => status === 'All' || b.status === status)
      .reduce((sum, b) => sum + (parseInt(b.amount.replace(/[^0-9]/g, '')) || 0), 0);
  };

  const formatRupiah = (num: number) => `Rp ${num.toLocaleString('id-ID')}`;

  const handleGenerateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const newBilling = {
        id: `INV-${Math.floor(Math.random() * 100000).toString().padStart(5, '0')}`,
        tenant_name: formData.tenant_name,
        unit: formData.unit,
        type: formData.type,
        amount: formData.amount,
        due_date: formData.due_date,
        status: formData.status
      };
      
      await addBilling(newBilling);
      gooeyToast.success("Invoice generated successfully!");
      setIsGenerateOpen(false);
      setFormData({ tenant_name: "", unit: "", type: "Rent", amount: "", due_date: "", status: "Pending" });
      fetchBilling(user?.role === 'tenant' ? user.name : undefined);
      setInvoiceToView(newBilling); // Auto open preview
    } catch (error) {
      gooeyToast.error("Failed to generate invoice");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!invoiceToDelete) return;
    setIsSubmitting(true);
    try {
      await deleteBilling(invoiceToDelete.id);
      gooeyToast.success("Invoice deleted successfully");
      setInvoiceToDelete(null);
      fetchBilling(user?.role === 'tenant' ? user.name : undefined);
    } catch (error) {
      gooeyToast.error("Failed to delete invoice");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePayBill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!invoiceToPay || !proofUrl) return;
    setIsSubmitting(true);
    try {
      await submitPaymentProof(invoiceToPay.id, proofUrl);
      gooeyToast.success("Payment proof submitted! Awaiting admin verification.");
      setInvoiceToPay(null);
      setProofUrl("");
      fetchBilling(user?.name);
    } catch (error) {
      gooeyToast.error("Failed to submit proof");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmPayment = async () => {
    if (!invoiceToReview) return;
    setIsSubmitting(true);
    try {
      await markInvoicePaid(invoiceToReview.id);
      gooeyToast.success("Payment confirmed and invoice marked as Paid!");
      setInvoiceToReview(null);
      fetchBilling();
    } catch (error) {
      gooeyToast.error("Failed to confirm payment");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteInvoice = async () => {
    if (!invoiceToDelete) return;
    setIsSubmitting(true);
    try {
      await deleteBilling(invoiceToDelete.id);
      gooeyToast.success("Invoice deleted successfully!");
      setInvoiceToDelete(null);
      fetchBilling();
    } catch (error) {
      gooeyToast.error("Failed to delete invoice");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      <InvoicePreviewModal 
        invoice={invoiceToView} 
        isOpen={!!invoiceToView} 
        onClose={() => setInvoiceToView(null)} 
      />
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={!!invoiceToDelete} onOpenChange={(open) => !open && setInvoiceToDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Invoice</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Are you sure you want to delete invoice <strong>{invoiceToDelete?.id}</strong> for {invoiceToDelete?.tenant_name}?</p>
            <p className="text-sm text-muted-foreground mt-2">This action cannot be undone and will remove the billing record permanently.</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setInvoiceToDelete(null)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteInvoice} disabled={isSubmitting}>
              {isSubmitting ? "Deleting..." : "Delete Invoice"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Billing & Invoices</h1>
          <p className="text-muted-foreground mt-1">Manage rent, utilities, and payment status.</p>
        </div>
        
        {user?.role === 'admin' && (
          <Dialog open={isGenerateOpen} onOpenChange={setIsGenerateOpen}>
              <Button onClick={() => setIsGenerateOpen(true)}>
                <MaterialIcon name="receipt" className="mr-2" /> Generate Invoice
              </Button>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Generate New Invoice</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleGenerateInvoice} className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="tenant">Tenant</Label>
                  <Input 
                    id="tenant" list="tenant-options"
                    value={formData.tenant_name} 
                    onChange={e => {
                      const selectedTenant = e.target.value;
                      // Autofill unit if we find a matching contract, else fallback to tenant base record
                      const matchingContract = activeContracts.find(c => c.tenant_name === selectedTenant && c.status === "Active");
                      const matchedTenant = availableTenants.find(t => t.name === selectedTenant);
                      const autofillUnit = matchingContract ? matchingContract.unit : (matchedTenant && matchedTenant.unit ? matchedTenant.unit : formData.unit);
                      
                      setFormData({
                        ...formData, 
                        tenant_name: selectedTenant,
                        unit: autofillUnit
                      });
                    }} 
                    required placeholder="Select tenant..." autoComplete="off"
                  />
                  <datalist id="tenant-options">
                    {availableTenants.map(t => <option key={t.id} value={t.name}>{t.name}</option>)}
                  </datalist>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="unit">Unit</Label>
                  <Input 
                    id="unit" list="unit-options"
                    value={formData.unit} onChange={e => setFormData({...formData, unit: e.target.value})} 
                    required placeholder="Select unit..." autoComplete="off"
                  />
                  <datalist id="unit-options">
                    {availableUnits.map(u => <option key={u.id} value={u.name}>{u.name} - {u.property}</option>)}
                  </datalist>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="type">Type</Label>
                    <select 
                      id="type" className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm"
                      value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}
                    >
                      <option value="Rent">Rent</option>
                      <option value="Utility">Utility</option>
                      <option value="Maintenance">Maintenance</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="due_date">Due Date</Label>
                    <Input id="due_date" type="date" value={formData.due_date} onChange={e => setFormData({...formData, due_date: e.target.value})} required />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="amount">Amount (Rp)</Label>
                  <Input id="amount" placeholder="e.g. 5.000.000" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} required />
                </div>
                
                <DialogFooter className="mt-6">
                  <Button type="button" variant="outline" onClick={() => setIsGenerateOpen(false)}>Cancel</Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Generating..." : "Generate Invoice"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
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

      {/* Pay Bill Modal (Tenant) */}
      <Dialog open={!!invoiceToPay} onOpenChange={(open) => !open && setInvoiceToPay(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Pay Invoice {invoiceToPay?.id}</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="bg-slate-50 p-4 rounded-lg border text-sm">
              <p className="mb-2">Total Amount Due: <strong className="text-lg">{invoiceToPay?.amount}</strong></p>
              <p className="font-semibold mt-4">Please transfer to:</p>
              <p>Bank: <strong>Bank BCA (Fiktif)</strong></p>
              <p>Account: <strong>Teridox Property</strong></p>
              <p>No: <strong>1234-5678-90</strong></p>
            </div>
            <form onSubmit={handlePayBill} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="proof">Upload Proof of Payment (Image URL for now)</Label>
                <Input 
                  id="proof" 
                  placeholder="https://example.com/receipt.jpg" 
                  value={proofUrl} 
                  onChange={e => setProofUrl(e.target.value)} 
                  required 
                />
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setInvoiceToPay(null)}>Cancel</Button>
                <Button type="submit" disabled={isSubmitting}>Submit Payment</Button>
              </DialogFooter>
            </form>
          </div>
        </DialogContent>
      </Dialog>

      {/* Review Payment Modal (Admin) */}
      <Dialog open={!!invoiceToReview} onOpenChange={(open) => !open && setInvoiceToReview(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Review Payment: {invoiceToReview?.id}</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <p className="text-sm">
              Tenant <strong>{invoiceToReview?.tenant_name}</strong> has submitted a payment proof for the amount of <strong>{invoiceToReview?.amount}</strong>.
            </p>
            <div className="bg-slate-100 rounded-lg p-2 border flex items-center justify-center min-h-[150px]">
              {invoiceToReview?.proof_of_payment ? (
                <img src={invoiceToReview.proof_of_payment} alt="Payment Proof" className="max-h-[300px] object-contain rounded" onError={(e) => (e.currentTarget.src = 'https://placehold.co/400x300?text=Invalid+Image+URL')} />
              ) : (
                <p className="text-muted-foreground text-sm">No image provided.</p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setInvoiceToReview(null)}>Close</Button>
            <Button onClick={handleConfirmPayment} disabled={isSubmitting} className="bg-emerald-600 hover:bg-emerald-700">
              <MaterialIcon name="check_circle" className="mr-2" /> Confirm Payment (Mark Paid)
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={!!invoiceToDelete} onOpenChange={(open) => !open && setInvoiceToDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Invoice</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Are you sure you want to delete invoice <strong>{invoiceToDelete?.id}</strong>?</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setInvoiceToDelete(null)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isSubmitting}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
                  <th className="px-6 py-3">Tenant Name</th>
                  <th className="px-6 py-3">Type</th>
                  <th className="px-6 py-3">Amount</th>
                  <th className="px-6 py-3">Due Date</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 rounded-tr-lg text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {mockBilling.map((invoice) => (
                  <tr key={invoice.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                    <td className="px-6 py-4 font-medium text-primary hover:underline cursor-pointer" onClick={() => setInvoiceToView(invoice)}>{invoice.id}</td>
                    <td className="px-6 py-4 font-bold text-foreground">{invoice.tenant_name}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <MaterialIcon 
                          name={invoice.type === 'Rent' ? 'home' : invoice.type === 'Utility' ? 'bolt' : 'build'} 
                          className="text-muted-foreground text-lg" 
                        />
                        {invoice.type}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium">{invoice.amount}</td>
                    <td className="px-6 py-4 text-muted-foreground">{invoice.due_date}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold tracking-wide 
                        ${invoice.status === 'Paid' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : ''}
                        ${invoice.status === 'Pending' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' : ''}
                        ${invoice.status === 'Pending Verification' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : ''}
                        ${invoice.status === 'Overdue' ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400' : ''}
                      `}>
                        {invoice.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        {/* Always available to all */}
                        <Button variant="ghost" size="icon-sm" onClick={() => printInvoice(invoice)} title="Download PDF">
                          <MaterialIcon name="download" className="text-muted-foreground hover:text-td-primary" />
                        </Button>

                        {/* Admin actions */}
                        {user?.role === 'admin' && (
                          <>
                            {invoice.status === 'Pending Verification' && (
                              <Button variant="ghost" size="icon-sm" onClick={() => setInvoiceToReview(invoice)} title="Review Payment">
                                <MaterialIcon name="fact_check" className="text-muted-foreground hover:text-blue-600" />
                              </Button>
                            )}
                            <Button variant="ghost" size="icon-sm" onClick={() => setInvoiceToDelete(invoice)} title="Delete">
                              <MaterialIcon name="delete" className="text-muted-foreground hover:text-rose-600" />
                            </Button>
                          </>
                        )}

                        {/* Tenant actions */}
                        {user?.role === 'tenant' && (invoice.status === 'Pending' || invoice.status === 'Overdue') && (
                          <Button variant="default" size="sm" onClick={() => setInvoiceToPay(invoice)} className="h-7 text-xs">
                            Pay Bill
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {mockBilling.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-muted-foreground">
                      No invoices found.
                    </td>
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
