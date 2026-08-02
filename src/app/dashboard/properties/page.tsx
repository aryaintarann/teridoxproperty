"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { getUnits, addUnit, updateUnit, deleteUnit, uploadImage } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { MaterialIcon } from "@/components/ui/material-icon";
import { gooeyToast } from "goey-toast";
import { useState, useEffect } from "react";
import type { Unit } from "@/types/unit";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";

const AMENITY_OPTIONS = [
  { icon: "wifi", label: "WiFi Cepat 100Mbps" },
  { icon: "ac_unit", label: "Smart AC" },
  { icon: "kitchen", label: "Dapur Lengkap" },
  { icon: "tv", label: "Smart TV 55\"" },
  { icon: "local_parking", label: "Area Parkir" },
  { icon: "key", label: "Akses Pintar 24 Jam" }
];

const DEFAULT_FORM = {
  name: "",
  property: "",
  type: "Studio",
  price: "",
  location: "",
  address: "",
  sqft: "",
  bed_type: "",
  floor_level: "",
  description: "",
  agentName: "",
  agentTitle: "",
  agentRating: "5.0"
};

export default function PropertiesPage() {
  const [availableUnits, setAvailableUnits] = useState<Unit[]>([]);
  
  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  
  // Form/Edit state
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedUnitId, setSelectedUnitId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [formData, setFormData] = useState(DEFAULT_FORM);

  // Target states
  const [unitToDelete, setUnitToDelete] = useState<string | null>(null);
  const [unitToView, setUnitToView] = useState<Unit | null>(null);

  const fetchUnits = () => {
    getUnits().then(setAvailableUnits);
  };

  useEffect(() => {
    fetchUnits();
  }, []);

  const handleAmenityToggle = (label: string) => {
    setSelectedAmenities(prev => 
      prev.includes(label) ? prev.filter(a => a !== label) : [...prev, label]
    );
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImageFiles(Array.from(e.target.files));
    }
  };

  const openAddModal = () => {
    setIsEditMode(false);
    setSelectedUnitId(null);
    setFormData(DEFAULT_FORM);
    setSelectedAmenities([]);
    setImageFiles([]);
    setIsFormOpen(true);
  };

  const openEditModal = (unit: Unit) => {
    setIsEditMode(true);
    setSelectedUnitId(unit.id);
    setFormData({
      name: unit.name,
      property: unit.property,
      type: unit.type,
      price: unit.price,
      location: unit.location || "",
      address: unit.address || "",
      sqft: unit.sqft || "",
      bed_type: unit.bed_type || "",
      floor_level: unit.floor_level || "",
      description: unit.description || "",
      agentName: unit.agent?.name || "",
      agentTitle: unit.agent?.title || "",
      agentRating: (unit.agent?.rating || 5.0).toString()
    });
    setSelectedAmenities(unit.amenities?.map(a => a.label) || []);
    setImageFiles([]);
    setIsFormOpen(true);
  };

  const openDeleteModal = (id: string) => {
    setUnitToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const openViewModal = (unit: Unit) => {
    setUnitToView(unit);
    setIsViewOpen(true);
  };

  const handleDelete = async () => {
    if (!unitToDelete) return;
    try {
      await deleteUnit(unitToDelete);
      gooeyToast.success("Property deleted successfully!");
      setIsDeleteDialogOpen(false);
      setUnitToDelete(null);
      fetchUnits();
    } catch (error) {
      gooeyToast.error("Failed to delete property.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // 1. Upload images if any
      const imageUrls: string[] = [];
      if (imageFiles.length > 0) {
        gooeyToast.success(`Uploading ${imageFiles.length} images...`);
        for (const file of imageFiles) {
          const url = await uploadImage(file);
          imageUrls.push(url);
        }
      }

      // 2. Format Amenities
      const amenities = AMENITY_OPTIONS.filter(opt => selectedAmenities.includes(opt.label));

      // 3. Format Agent
      const agent = {
        name: formData.agentName || "Agen Internal",
        title: formData.agentTitle || "Agen Properti",
        rating: parseFloat(formData.agentRating) || 5.0,
        photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop"
      };

      // 4. Construct Payload
      const payload: Partial<Unit> = {
        name: formData.name,
        property: formData.property,
        type: formData.type as any,
        price: formData.price,
        location: formData.location || "Jakarta",
        address: formData.address || "Jakarta",
        price_numeric: parseInt(formData.price.replace(/[^0-9]/g, '')) || 0,
        sqft: formData.sqft,
        bed_type: formData.bed_type,
        floor_level: formData.floor_level,
        description: formData.description,
        agent: agent
      };

      if (imageUrls.length > 0) {
        payload.images = imageUrls;
      }
      if (amenities.length > 0) {
        payload.amenities = amenities;
      }
      
      if (isEditMode && selectedUnitId) {
        await updateUnit(selectedUnitId, payload);
        gooeyToast.success("Property updated successfully!");
      } else {
        payload.status = "Tersedia";
        payload.rating = 5.0;
        await addUnit(payload as Omit<Unit, 'id'>);
        gooeyToast.success("Property added successfully!");
      }

      setIsFormOpen(false);
      fetchUnits();
      
    } catch (error) {
      gooeyToast.error(`Failed to ${isEditMode ? "update" : "add"} property.`);
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
        <Button onClick={openAddModal}>
          <MaterialIcon name="add" className="mr-2" /> Add Property
        </Button>
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
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 rounded-tr-lg text-right">Actions</th>
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
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon-sm" onClick={() => openViewModal(unit)}>
                          <MaterialIcon name="visibility" className="text-muted-foreground hover:text-primary transition-colors" />
                        </Button>
                        <Button variant="ghost" size="icon-sm" onClick={() => openEditModal(unit)}>
                          <MaterialIcon name="edit" className="text-muted-foreground hover:text-blue-500 transition-colors" />
                        </Button>
                        <Button variant="ghost" size="icon-sm" onClick={() => openDeleteModal(unit.id)}>
                          <MaterialIcon name="delete" className="text-muted-foreground hover:text-red-500 transition-colors" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* 1. Add/Edit Modal */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-6xl max-w-6xl w-[90vw] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isEditMode ? "Edit Property" : "Add New Property"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-6 py-4">
            
            {/* Seksi Dasar */}
            <div>
              <h3 className="font-semibold text-lg mb-2 text-primary">Informasi Dasar</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Unit Name</Label>
                  <Input id="name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required placeholder="e.g. A-105" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="property">Property / Building</Label>
                  <Input id="property" value={formData.property} onChange={e => setFormData({...formData, property: e.target.value})} required placeholder="e.g. Teridox Heights" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Type</Label>
                  <select id="type" className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                    <option value="Studio">Studio</option>
                    <option value="Standard">Standard</option>
                    <option value="Suite">Suite</option>
                    <option value="Loft">Loft</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Price / bln</Label>
                  <Input id="price" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} required placeholder="Rp 2.500.000" />
                </div>
              </div>
            </div>

            {/* Seksi Detail */}
            <div>
              <h3 className="font-semibold text-lg mb-2 text-primary">Detail Ruangan & Lokasi</h3>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="space-y-2">
                  <Label htmlFor="location">Wilayah</Label>
                  <Input id="location" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} placeholder="e.g. Kuningan, Jakarta Selatan" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sqft">Luas (sqft / m²)</Label>
                  <Input id="sqft" value={formData.sqft} onChange={e => setFormData({...formData, sqft: e.target.value})} placeholder="e.g. 45m²" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bed_type">Tipe Kasur</Label>
                  <Input id="bed_type" value={formData.bed_type} onChange={e => setFormData({...formData, bed_type: e.target.value})} placeholder="e.g. 1 Queen Bed" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="floor_level">Lantai</Label>
                  <Input id="floor_level" value={formData.floor_level} onChange={e => setFormData({...formData, floor_level: e.target.value})} placeholder="e.g. Lantai 12" />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="address">Alamat Lengkap</Label>
                  <Input id="address" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} placeholder="e.g. Jl. HR Rasuna Said" required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Deskripsi Lengkap</Label>
                <textarea id="description" className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring min-h-[100px]" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Tuliskan deskripsi unit yang menarik..." />
              </div>
            </div>

            {/* Seksi Media & Fasilitas */}
            <div>
              <h3 className="font-semibold text-lg mb-2 text-primary">Media & Fasilitas</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="images">Upload Foto Unit (Kosongkan jika tidak ingin mengubah)</Label>
                  <Input id="images" type="file" multiple accept="image/*" onChange={handleFileChange} className="cursor-pointer" />
                </div>
                
                <div className="space-y-2">
                  <Label>Fasilitas</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {AMENITY_OPTIONS.map(opt => (
                      <label key={opt.icon} className="flex items-center space-x-2 text-sm border p-2 rounded cursor-pointer hover:bg-muted/50 transition-colors">
                        <input type="checkbox" checked={selectedAmenities.includes(opt.label)} onChange={() => handleAmenityToggle(opt.label)} className="rounded border-input text-primary focus:ring-primary" />
                        <MaterialIcon name={opt.icon} className="text-sm text-primary" />
                        <span>{opt.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Seksi Agen */}
            <div>
              <h3 className="font-semibold text-lg mb-2 text-primary">Informasi Agen</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="agentName">Nama Agen</Label>
                  <Input id="agentName" value={formData.agentName} onChange={e => setFormData({...formData, agentName: e.target.value})} placeholder="e.g. Amanda S." />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="agentTitle">Jabatan</Label>
                  <Input id="agentTitle" value={formData.agentTitle} onChange={e => setFormData({...formData, agentTitle: e.target.value})} placeholder="e.g. Property Manager" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="agentRating">Rating (1-5)</Label>
                  <Input id="agentRating" type="number" step="0.1" min="1" max="5" value={formData.agentRating} onChange={e => setFormData({...formData, agentRating: e.target.value})} placeholder="5.0" />
                </div>
              </div>
            </div>

            <DialogFooter className="pt-6 border-t mt-4">
              <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>Batal</Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Menyimpan..." : (isEditMode ? "Simpan Perubahan" : "Simpan Properti")}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* 2. Delete Confirmation Modal */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Konfirmasi Penghapusan</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground">Apakah Anda yakin ingin menghapus unit ini secara permanen? Aksi ini tidak dapat dibatalkan.</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Batal</Button>
            <Button variant="destructive" onClick={handleDelete}>Hapus Unit</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 3. View Details Modal */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="sm:max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detail Unit: {unitToView?.name}</DialogTitle>
          </DialogHeader>
          {unitToView && (
            <div className="space-y-6 py-4">
              {/* Images Preview */}
              {unitToView.images && unitToView.images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {unitToView.images.map((img, i) => (
                    <div key={i} className="relative h-24 rounded-md overflow-hidden">
                      <Image src={img} alt={`Unit Image ${i}`} fill className="object-cover" />
                    </div>
                  ))}
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Properti</p>
                  <p className="font-semibold">{unitToView.property}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Tipe</p>
                  <p className="font-semibold">{unitToView.type}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Harga</p>
                  <p className="font-semibold">{unitToView.price}/bulan</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Status</p>
                  <p className="font-semibold">{unitToView.status}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Lokasi</p>
                  <p className="font-semibold">{unitToView.location || "-"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Luas Ruangan</p>
                  <p className="font-semibold">{unitToView.sqft || "-"}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-muted-foreground">Alamat Lengkap</p>
                  <p className="font-semibold">{unitToView.address || "-"}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-muted-foreground">Deskripsi</p>
                  <p className="font-medium mt-1 p-3 bg-muted/30 rounded-md whitespace-pre-wrap">{unitToView.description || "Tidak ada deskripsi."}</p>
                </div>
              </div>

              {unitToView.amenities && (
                <div>
                  <h4 className="font-semibold mb-2">Fasilitas</h4>
                  <div className="flex flex-wrap gap-2">
                    {unitToView.amenities.map(a => (
                      <span key={a.label} className="inline-flex items-center gap-1 bg-muted px-2 py-1 rounded text-xs">
                        <MaterialIcon name={a.icon} className="text-[14px]" /> {a.label}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {unitToView.agent && (
                <div>
                  <h4 className="font-semibold mb-2">Agen Properti</h4>
                  <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10 rounded-full overflow-hidden">
                      <Image src={unitToView.agent.photo || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop"} alt={unitToView.agent.name} fill className="object-cover" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{unitToView.agent.name}</p>
                      <p className="text-xs text-muted-foreground">{unitToView.agent.title} • {unitToView.agent.rating} Star</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsViewOpen(false)}>Tutup</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
