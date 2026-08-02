"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { getTenants, addTenant, getUnits } from "@/lib/api";
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
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    unit: "",
    password: "",
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const newTenant = {
        id: `T${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        unit: formData.unit,
        password: formData.password,
        requires_password_change: true,
        status: "Active",
        joined_at: new Date().toISOString().split('T')[0],
      };
      
      await addTenant(newTenant);
      gooeyToast.success("Tenant added successfully!");
      setIsOpen(false);
      fetchData();
      setFormData({ name: "", email: "", phone: "", unit: "", password: "" });
    } catch (error) {
      gooeyToast.error("Failed to add tenant");
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
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger render={<Button />}>
              <MaterialIcon name="person_add" className="mr-2" /> Add Tenant
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Register New Tenant</DialogTitle>
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
                <Label htmlFor="password">Initial Password</Label>
                <div className="flex gap-2">
                  <Input id="password" type="text" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} required placeholder="Enter or generate password" />
                  <Button type="button" variant="outline" onClick={generatePassword}>Generate</Button>
                </div>
                <p className="text-xs text-muted-foreground">Tenant will be required to change this upon first login.</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} required placeholder="08123456789" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="unit">Assigned Unit</Label>
                  <Input id="unit" list="units-list" value={formData.unit} onChange={e => setFormData({...formData, unit: e.target.value})} required placeholder="Search unit..." autoComplete="off" />
                  <datalist id="units-list">
                    {availableUnits.map(u => (
                      <option key={u.id} value={`${u.name} - ${u.type} (${u.property})`} />
                    ))}
                  </datalist>
                </div>
              </div>
              <DialogFooter className="pt-4">
                <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={isSubmitting}>Register Tenant</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
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
                    <td className="px-6 py-4 max-w-[200px] truncate" title={tenant.unit}>{tenant.unit}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span>{tenant.email}</span>
                        <span className="text-xs text-muted-foreground">{tenant.phone}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">{tenant.joinedAt || tenant.joined_at}</td>
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
