"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { getContracts, getTenants, getUnits, addContract, deleteContract, updateUnitStatusByName } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { MaterialIcon } from "@/components/ui/material-icon";
import { gooeyToast } from "goey-toast";
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectItem } from "@/components/ui/select";
import { ContractPreviewModal, printContract } from "@/components/dashboard/ContractPreviewModal";

export default function ContractsPage() {
  const [mockContracts, setMockContracts] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);

  // Form dependencies
  const [availableTenants, setAvailableTenants] = useState<any[]>([]);
  const [availableUnits, setAvailableUnits] = useState<any[]>([]);

  // Form state
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [contractToView, setContractToView] = useState<any>(null);
  const [contractToDelete, setContractToDelete] = useState<any>(null);
  const [formData, setFormData] = useState({
    tenant_name: "",
    unit: "",
    start_date: "",
    end_date: "",
    status: "Active"
  });

  const fetchData = async (tenantName?: string) => {
    const contracts = await getContracts(tenantName);
    setMockContracts(contracts);
    
    // Fetch tenants and units for dropdowns (only needed if admin)
    const session = localStorage.getItem("teridox_session");
    if (session) {
      const parsed = JSON.parse(session);
      if (parsed.role === 'admin') {
        const [tenants, units] = await Promise.all([getTenants(), getUnits()]);
        setAvailableTenants(tenants);
        setAvailableUnits(units);
      }
    }
  };

  useEffect(() => {
    const session = localStorage.getItem("teridox_session");
    let tenantName = undefined;
    if (session) {
      const parsed = JSON.parse(session);
      setUser(parsed);
      if (parsed.role === 'tenant') {
        tenantName = parsed.name;
      }
    }
    fetchData(tenantName);
  }, []);

  const handleTenantChange = (val: string | null) => {
    const selectedTenant = availableTenants.find(t => t.name === val);
    setFormData({
      ...formData, 
      tenant_name: val || '',
      // If the tenant already has a unit assigned in their profile, auto-select it
      unit: selectedTenant?.unit || formData.unit
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // Create new contract
      const newContract = {
        id: `C-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
        tenant_id: `T${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`, // Mock tenant ID for now, since we only store names in the form
        tenant_name: formData.tenant_name,
        unit: formData.unit,
        start_date: formData.start_date,
        end_date: formData.end_date,
        status: formData.status
      };
      
      // If we find the real tenant ID from the selected tenant name, use it
      const matchedTenant = availableTenants.find(t => t.name === formData.tenant_name);
      if (matchedTenant) {
        newContract.tenant_id = matchedTenant.id;
      }

      await addContract(newContract);
      
      // Mark unit as occupied
      if (formData.unit && formData.status === "Active") {
        await updateUnitStatusByName(formData.unit, "Terisi");
      }
      
      gooeyToast.success("Contract drafted successfully!");
      setIsOpen(false);
      setFormData({ tenant_name: "", unit: "", start_date: "", end_date: "", status: "Active" });
      fetchData(); // Refresh data
      
      // Open the preview modal automatically
      setContractToView(newContract);
    } catch (error) {
      gooeyToast.error("Failed to draft contract");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!contractToDelete) return;
    setIsSubmitting(true);
    try {
      await deleteContract(contractToDelete.id);
      
      // Free up the unit if it was deleted
      if (contractToDelete.unit && contractToDelete.status === "Active") {
        await updateUnitStatusByName(contractToDelete.unit, "Tersedia");
      }
      
      gooeyToast.success("Contract deleted successfully!");
      setContractToDelete(null);
      fetchData();
    } catch (error) {
      gooeyToast.error("Failed to delete contract");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <ContractPreviewModal 
        contract={contractToView} 
        isOpen={!!contractToView} 
        onClose={() => setContractToView(null)} 
      />
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={!!contractToDelete} onOpenChange={(open) => !open && setContractToDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Contract</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Are you sure you want to delete contract <strong>{contractToDelete?.id}</strong> for {contractToDelete?.tenant_name}?</p>
            <p className="text-sm text-muted-foreground mt-2">This action cannot be undone and will remove the contract record permanently.</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setContractToDelete(null)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isSubmitting}>
              {isSubmitting ? "Deleting..." : "Delete Contract"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Contracts</h1>
          <p className="text-muted-foreground mt-1">Manage lease agreements and renewals.</p>
        </div>
        
        {user?.role === 'admin' && (
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <Button onClick={() => setIsOpen(true)}>
            <MaterialIcon name="description" className="mr-2" /> Draft Contract
          </Button>
          <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Draft New Contract</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="tenant">Tenant</Label>
                  <Select 
                    value={formData.tenant_name} 
                    onValueChange={handleTenantChange}
                    required
                  >
                    <SelectTrigger id="tenant" className="w-full h-10">
                      <SelectValue placeholder="Select a tenant..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {availableTenants.map(t => (
                          <SelectItem key={t.id} value={t.name}>{t.name} ({t.email})</SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="unit">Unit</Label>
                  <Select 
                    value={formData.unit} 
                    onValueChange={(val) => setFormData({...formData, unit: val || ''})}
                    required
                  >
                    <SelectTrigger id="unit" className="w-full h-10">
                      <SelectValue placeholder="Select an available unit..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {availableUnits.filter(u => u.status === 'Tersedia' || u.name === formData.unit).map(u => (
                          <SelectItem key={u.id} value={u.name}>{u.name} - {u.property}</SelectItem>
                        ))}
                        {availableUnits.filter(u => u.status === 'Tersedia' || u.name === formData.unit).length === 0 && (
                          <div className="p-2 text-sm text-muted-foreground text-center">No units available</div>
                        )}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="start_date">Start Date</Label>
                    <Input 
                      id="start_date" 
                      type="date"
                      value={formData.start_date} 
                      onChange={e => setFormData({...formData, start_date: e.target.value})} 
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="end_date">End Date</Label>
                    <Input 
                      id="end_date" 
                      type="date"
                      value={formData.end_date} 
                      onChange={e => setFormData({...formData, end_date: e.target.value})} 
                      required 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Initial Status</Label>
                  <select 
                    id="status" 
                    className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={formData.status} 
                    onChange={e => setFormData({...formData, status: e.target.value})}
                  >
                    <option value="Active">Active</option>
                    <option value="Pending">Pending</option>
                  </select>
                </div>
                
                <DialogFooter className="mt-6">
                  <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <span className="flex items-center"><MaterialIcon name="sync" className="animate-spin mr-2 text-sm" /> Saving...</span>
                    ) : "Draft Contract"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        )}
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
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 rounded-tr-lg text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {mockContracts.map((contract) => (
                  <tr key={contract.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                    <td className="px-6 py-4 font-medium text-primary hover:underline cursor-pointer" onClick={() => setContractToView(contract)}>{contract.id}</td>
                    <td className="px-6 py-4 font-bold text-foreground">{contract.tenant_name}</td>
                    <td className="px-6 py-4">{contract.unit}</td>
                    <td className="px-6 py-4">
                      {contract.start_date} - {contract.end_date}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold tracking-wide 
                        ${contract.status === 'Active' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : ''}
                        ${contract.status === 'Pending' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : ''}
                        ${contract.status === 'Expiring Soon' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' : ''}
                        ${contract.status === 'Expired' ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400' : ''}
                      `}>
                        {contract.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon-sm" onClick={() => setContractToView(contract)}>
                          <MaterialIcon name="visibility" className="text-muted-foreground hover:text-primary transition-colors" />
                        </Button>
                        <Button variant="ghost" size="icon-sm" onClick={() => printContract(contract)}>
                          <MaterialIcon name="download" className="text-muted-foreground hover:text-td-primary transition-colors" />
                        </Button>
                        {user?.role === 'admin' && (
                          <Button variant="ghost" size="icon-sm" onClick={() => setContractToDelete(contract)}>
                            <MaterialIcon name="delete" className="text-muted-foreground hover:text-rose-600 transition-colors" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {mockContracts.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                      No contracts found.
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
