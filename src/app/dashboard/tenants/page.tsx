"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { getTenants, addTenant, getUnits, updateTenant, deleteTenant, getBilling, getMaintenance } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { MaterialIcon } from "@/components/ui/material-icon";
import { gooeyToast } from "goey-toast";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import type { Unit } from "@/types/unit";

export default function TenantsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [mockTenants, setMockTenants] = useState<any[]>([]);
  const [availableUnits, setAvailableUnits] = useState<Unit[]>([]);
  
  // Modals state
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  
  // Edit & View state
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState<any>(null);
  
  // View Details Sub-data
  const [tenantBilling, setTenantBilling] = useState<any[]>([]);
  const [tenantMaintenance, setTenantMaintenance] = useState<any[]>([]);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    unit: "",
    password: "",
    status: "Active",
  });

  const fetchData = async () => {
    const [tenantsData, unitsData] = await Promise.all([getTenants(), getUnits()]);
    setMockTenants(tenantsData);
    setAvailableUnits(unitsData);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const generatePassword = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$";
    let pwd = "";
    for(let i=0; i<10; i++) pwd += chars.charAt(Math.floor(Math.random() * chars.length));
    setFormData({...formData, password: pwd});
  };

  const openAddModal = () => {
    setIsEditMode(false);
    setFormData({ name: "", email: "", phone: "", unit: "", password: "", status: "Active" });
    setIsOpen(true);
  };

  const openEditModal = (tenant: any) => {
    setIsEditMode(true);
    setSelectedTenant(tenant);
    setFormData({ 
      name: tenant.name, 
      email: tenant.email, 
      phone: tenant.phone, 
      unit: tenant.unit, 
      password: "", // Excluded from edit
      status: tenant.status 
    });
    setIsOpen(true);
  };

  const openDeleteModal = (tenant: any) => {
    setSelectedTenant(tenant);
    setIsDeleteDialogOpen(true);
  };

  const openViewModal = async (tenant: any) => {
    setSelectedTenant(tenant);
    setIsViewOpen(true);
    // Fetch sub-data for the view modal
    try {
      const [billing, maintenance] = await Promise.all([
        getBilling(tenant.name),
        getMaintenance(tenant.name)
      ]);
      setTenantBilling(billing);
      setTenantMaintenance(maintenance);
    } catch (e) {
      console.error("Failed to fetch tenant sub-data", e);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (isEditMode && selectedTenant) {
        // Edit Tenant
        const updates = {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          unit: formData.unit,
          status: formData.status
        };
        await updateTenant(selectedTenant.id, updates);
        gooeyToast.success("Tenant updated successfully!");
      } else {
        // Add Tenant
        const newTenant = {
          id: `T${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          unit: formData.unit,
          password: formData.password,
          requires_password_change: true,
          status: formData.status,
          joined_at: new Date().toISOString().split('T')[0],
        };
        await addTenant(newTenant);
        gooeyToast.success("Tenant added successfully!");
      }
      setIsOpen(false);
      fetchData();
    } catch (error) {
      gooeyToast.error(isEditMode ? "Failed to update tenant" : "Failed to add tenant");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedTenant) return;
    setIsSubmitting(true);
    try {
      await deleteTenant(selectedTenant.id);
      gooeyToast.success("Tenant deleted successfully!");
      setIsDeleteDialogOpen(false);
      fetchData();
    } catch (error) {
      gooeyToast.error("Failed to delete tenant");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredTenants = mockTenants.filter(tenant => 
    tenant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tenant.unit.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tenant.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tenants</h1>
          <p className="text-muted-foreground mt-1">Manage tenant profiles and communications.</p>
        </div>
        
        {/* Main Add / Edit Dialog */}
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger render={<Button onClick={openAddModal} />}>
              <MaterialIcon name="person_add" className="mr-2" /> Add Tenant
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{isEditMode ? "Edit Tenant Profile" : "Register New Tenant"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required placeholder="John Doe" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required placeholder="john@example.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} required placeholder="081234567890" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="unit">Assigned Unit</Label>
                <Input 
                  id="unit" 
                  list="unit-options" 
                  value={formData.unit} 
                  onChange={e => setFormData({...formData, unit: e.target.value})} 
                  required 
                  placeholder="Type or select a unit..." 
                  autoComplete="off"
                />
                <datalist id="unit-options">
                  {availableUnits.map((u) => (
                    <option key={u.id} value={u.name}>
                      {u.name} - {u.type} ({u.property})
                    </option>
                  ))}
                </datalist>
              </div>
              
              {isEditMode && (
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <select 
                    id="status" 
                    className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={formData.status} 
                    onChange={e => setFormData({...formData, status: e.target.value})}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              )}

              {!isEditMode && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="password">Initial Password</Label>
                    <Button type="button" variant="ghost" size="sm" onClick={generatePassword} className="h-6 text-xs text-td-primary">
                      Generate
                    </Button>
                  </div>
                  <Input id="password" type="text" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} required placeholder="••••••••" />
                  <p className="text-xs text-muted-foreground">Tenant will be required to change this upon first login.</p>
                </div>
              )}
              
              <DialogFooter className="mt-6">
                <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <span className="flex items-center"><MaterialIcon name="sync" className="animate-spin mr-2 text-sm" /> Saving...</span>
                  ) : (isEditMode ? "Update Tenant" : "Add Tenant")}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Tenant</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              Are you sure you want to delete <strong className="text-foreground">{selectedTenant?.name}</strong>? This action cannot be undone and will remove their access to the portal.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} disabled={isSubmitting}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isSubmitting}>
              {isSubmitting ? "Deleting..." : "Delete Permanently"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Details Dialog */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="sm:max-w-[550px] max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
              <MaterialIcon name="account_circle" className="text-primary text-3xl" />
              Tenant Details
            </DialogTitle>
          </DialogHeader>
          {selectedTenant && (
            <div className="space-y-6 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted/30 p-3 rounded-lg border border-border/50">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Full Name</p>
                  <p className="font-semibold">{selectedTenant.name}</p>
                </div>
                <div className="bg-muted/30 p-3 rounded-lg border border-border/50">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Status</p>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold tracking-wide border inline-block
                    ${selectedTenant.status === 'Active' ? 'bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-900/20 dark:border-emerald-800 dark:text-emerald-400' : 'bg-rose-50 border-rose-200 text-rose-700 dark:bg-rose-900/20 dark:border-rose-800 dark:text-rose-400'}
                  `}>
                    {selectedTenant.status}
                  </span>
                </div>
                <div className="bg-muted/30 p-3 rounded-lg border border-border/50">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Unit</p>
                  <p className="font-semibold">{selectedTenant.unit}</p>
                </div>
                <div className="bg-muted/30 p-3 rounded-lg border border-border/50">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Joined Date</p>
                  <p className="font-medium text-sm">{selectedTenant.joined_at}</p>
                </div>
                <div className="col-span-2 bg-muted/30 p-3 rounded-lg border border-border/50 flex flex-col gap-2">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Contact Info</p>
                    <div className="flex items-center gap-2 text-sm">
                      <MaterialIcon name="mail" className="text-muted-foreground text-sm" />
                      <a href={`mailto:${selectedTenant.email}`} className="text-primary hover:underline">{selectedTenant.email}</a>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-sm">
                      <MaterialIcon name="phone" className="text-muted-foreground text-sm" />
                      <span>{selectedTenant.phone}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-border/50">
                <h4 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4">Portal Activity</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-900/50 p-4 rounded-xl flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-amber-800 dark:text-amber-400">Unpaid Bills</p>
                      <p className="text-2xl font-bold text-amber-900 dark:text-amber-300">
                        {tenantBilling.filter(b => b.status === 'Unpaid').length}
                      </p>
                    </div>
                    <MaterialIcon name="receipt_long" className="text-3xl text-amber-400/50 dark:text-amber-500/30" />
                  </div>
                  
                  <div className="bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200/50 dark:border-blue-900/50 p-4 rounded-xl flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-800 dark:text-blue-400">Open Tickets</p>
                      <p className="text-2xl font-bold text-blue-900 dark:text-blue-300">
                        {tenantMaintenance.filter(t => t.status !== 'Resolved').length}
                      </p>
                    </div>
                    <MaterialIcon name="build" className="text-3xl text-blue-400/50 dark:text-blue-500/30" />
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Card className="shadow-sm">
        <CardHeader className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <CardTitle>Tenant Directory</CardTitle>
            <CardDescription>All registered tenants and their current units.</CardDescription>
          </div>
          <div className="relative w-full md:w-64">
            <MaterialIcon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input 
              placeholder="Search tenants..." 
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs uppercase bg-muted/50 text-muted-foreground">
                <tr>
                  <th className="px-6 py-3 rounded-tl-lg">Tenant Name</th>
                  <th className="px-6 py-3">Unit</th>
                  <th className="px-6 py-3">Contact</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Joined Date</th>
                  <th className="px-6 py-3 rounded-tr-lg">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTenants.length > 0 ? (
                  filteredTenants.map((tenant) => (
                    <tr key={tenant.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                      <td className="px-6 py-4 font-bold text-foreground">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                            {tenant.name.substring(0, 2).toUpperCase()}
                          </div>
                          {tenant.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 font-medium">{tenant.unit}</td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col text-xs text-muted-foreground">
                          <span>{tenant.email}</span>
                          <span>{tenant.phone}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold tracking-wide border
                          ${tenant.status === 'Active' ? 'bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-900/20 dark:border-emerald-800 dark:text-emerald-400' : 'bg-rose-50 border-rose-200 text-rose-700 dark:bg-rose-900/20 dark:border-rose-800 dark:text-rose-400'}
                        `}>
                          {tenant.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-muted-foreground">{tenant.joined_at}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/30" onClick={() => openViewModal(tenant)}>
                            <MaterialIcon name="visibility" className="text-lg" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-amber-600 hover:text-amber-700 hover:bg-amber-50 dark:hover:bg-amber-900/30" onClick={() => openEditModal(tenant)}>
                            <MaterialIcon name="edit" className="text-lg" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-900/30" onClick={() => openDeleteModal(tenant)}>
                            <MaterialIcon name="delete" className="text-lg" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                      No tenants found matching your search.
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
