"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { getUnits, addUnit } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { MaterialIcon } from "@/components/ui/material-icon";
import { gooeyToast } from "goey-toast";
import { useState, useEffect } from "react";
import type { Unit } from "@/types/unit";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function PropertiesPage() {
  const [availableUnits, setAvailableUnits] = useState<Unit[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    property: "",
    type: "Studio",
    price: "",
  });

  const fetchUnits = () => {
    getUnits().then(setAvailableUnits);
  };

  useEffect(() => {
    fetchUnits();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // Mock some default fields for the new unit
      const newUnit = {
        name: formData.name,
        property: formData.property,
        type: formData.type,
        price: formData.price,
        location: "Jakarta",
        address: "New Address",
        price_numeric: parseInt(formData.price.replace(/[^0-9]/g, '')) || 0,
        status: "Tersedia",
        rating: 5.0,
      };
      
      await addUnit(newUnit as any);
      gooeyToast.success("Property added successfully!");
      setIsOpen(false);
      fetchUnits();
      setFormData({ name: "", property: "", type: "Studio", price: "" });
    } catch (error) {
      gooeyToast.error("Failed to add property");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Properties & Units</h1>
          <p className="text-muted-foreground mt-1">Manage your properties and available units.</p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger render={<Button />}>
              <MaterialIcon name="add" className="mr-2" /> Add Property
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Property</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Unit Name</Label>
                <Input id="name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required placeholder="e.g. A-105" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="property">Building / Property</Label>
                <Input id="property" value={formData.property} onChange={e => setFormData({...formData, property: e.target.value})} required placeholder="e.g. Teridox Heights" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Type</Label>
                  <select id="type" className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                    <option value="Studio">Studio</option>
                    <option value="Standard">Standard</option>
                    <option value="Suite">Suite</option>
                    <option value="Loft">Loft</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Price</Label>
                  <Input id="price" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} required placeholder="Rp 2.500.000" />
                </div>
              </div>
              <DialogFooter className="pt-4">
                <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={isSubmitting}>Save Property</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>All Units</CardTitle>
          <CardDescription>A list of all managed units.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs uppercase bg-muted/50 text-muted-foreground">
                <tr>
                  <th className="px-6 py-3 rounded-tl-lg">Unit Name</th>
                  <th className="px-6 py-3">Property</th>
                  <th className="px-6 py-3">Type</th>
                  <th className="px-6 py-3">Price</th>
                  <th className="px-6 py-3 rounded-tr-lg">Status</th>
                </tr>
              </thead>
              <tbody>
                {availableUnits.map((unit) => (
                  <tr key={unit.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                    <td className="px-6 py-4 font-medium text-foreground">{unit.name}</td>
                    <td className="px-6 py-4">{unit.property}</td>
                    <td className="px-6 py-4">{unit.type}</td>
                    <td className="px-6 py-4">{unit.price}/bln</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold tracking-wide ${unit.status === 'Tersedia' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'}`}>
                        {unit.status}
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
