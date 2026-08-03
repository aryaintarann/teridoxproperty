"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { getMaintenance, getContracts, addMaintenance, updateMaintenanceStatus, deleteMaintenance, getTenantByName } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { MaterialIcon } from "@/components/ui/material-icon";
import { gooeyToast } from "goey-toast";
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectItem } from "@/components/ui/select";

export default function MaintenancePage() {
  const [mockMaintenance, setMockMaintenance] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  
  const [isOpen, setIsOpen] = useState(false);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [photoToView, setPhotoToView] = useState<string | null>(null);
  
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [ticketToView, setTicketToView] = useState<any>(null);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [ticketToDelete, setTicketToDelete] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [activeContracts, setActiveContracts] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    unit: "",
    issue: "",
    priority: "Medium",
    photo_url: ""
  });

  const fetchMaintenance = async () => {
    const session = localStorage.getItem("teridox_session");
    let tenantName = undefined;
    if (session) {
      const parsed = JSON.parse(session);
      setUser(parsed);
      if (parsed.role === 'tenant') {
        tenantName = parsed.name;
        // Fetch contracts for tenant to select unit
        const contracts = await getContracts(tenantName);
        let active = contracts.filter(c => c.status === "Active" || c.status === "Expiring Soon");
        
        // Fallback: If no active contract, try fetching unit assigned to tenant in Tenants table
        if (active.length === 0) {
          const tenantRecord = await getTenantByName(tenantName);
          if (tenantRecord && tenantRecord.unit) {
            active = [{ unit: tenantRecord.unit }];
          }
        }
        setActiveContracts(active);
      }
    }
    const data = await getMaintenance(tenantName);
    // sort by latest date
    setMockMaintenance(data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
  };

  useEffect(() => {
    fetchMaintenance();
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      await updateMaintenanceStatus(id, newStatus);
      gooeyToast.success(`Ticket marked as ${newStatus}`);
      fetchMaintenance();
    } catch (error) {
      gooeyToast.error("Failed to update status");
    }
  };

  const handleDelete = async () => {
    if (!ticketToDelete) return;
    try {
      await deleteMaintenance(ticketToDelete.id);
      gooeyToast.success("Maintenance ticket deleted");
      setIsDeleteDialogOpen(false);
      setTicketToDelete(null);
      fetchMaintenance();
    } catch (error) {
      gooeyToast.error("Failed to delete ticket");
    }
  };

  const handleSubmitRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const payload = {
        id: `M-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
        unit: formData.unit,
        issue: formData.issue,
        priority: formData.priority,
        photo_url: formData.photo_url || null,
        status: "New",
        reported_by: user.name,
        date: new Date().toISOString().split('T')[0] // current date
      };
      
      await addMaintenance(payload);
      gooeyToast.success("Maintenance request submitted successfully!");
      setIsOpen(false);
      setFormData({ unit: "", issue: "", priority: "Medium", photo_url: "" });
      fetchMaintenance();
    } catch (error) {
      gooeyToast.error("Failed to submit request.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Maintenance Requests</h1>
          <p className="text-muted-foreground mt-1">Track and resolve issues reported by tenants.</p>
        </div>
        
        {user?.role === 'tenant' && (
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <Button onClick={() => {
              if (activeContracts.length > 0) {
                setFormData(prev => ({ ...prev, unit: activeContracts[0].unit }));
              }
              setIsOpen(true);
            }}>
              <MaterialIcon name="build" className="mr-2" /> Report Issue
            </Button>
            
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Report Maintenance Issue</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmitRequest} className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="unit">Unit</Label>
                  {activeContracts.length === 1 ? (
                    <Input id="unit" value={formData.unit} disabled />
                  ) : (
                    <Select 
                      value={formData.unit} 
                      onValueChange={(val) => setFormData({...formData, unit: val || ''})}
                      required
                    >
                      <SelectTrigger id="unit" className="w-full h-10">
                        <SelectValue placeholder="Select your unit..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {activeContracts.map((c, i) => (
                            <SelectItem key={i} value={c.unit}>{c.unit}</SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="issue">Issue Description</Label>
                  <textarea 
                    id="issue" 
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={formData.issue} 
                    onChange={e => setFormData({...formData, issue: e.target.value})} 
                    required 
                    placeholder="Describe the problem clearly..." 
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select 
                    value={formData.priority} 
                    onValueChange={(val) => setFormData({...formData, priority: val || 'Medium'})}
                  >
                    <SelectTrigger id="priority" className="w-full h-10">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="Low">Low</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="High">High</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="photo">Photo URL (Optional)</Label>
                  <Input 
                    id="photo" 
                    type="url"
                    value={formData.photo_url} 
                    onChange={e => setFormData({...formData, photo_url: e.target.value})} 
                    placeholder="https://..." 
                  />
                  <p className="text-xs text-muted-foreground">Upload your photo to an image host or Supabase and paste the link here to help technicians understand the damage.</p>
                </div>

                <DialogFooter className="mt-6">
                  <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <span className="flex items-center"><MaterialIcon name="sync" className="animate-spin mr-2 text-sm" /> Submitting...</span>
                    ) : "Submit Request"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        )}
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
                    <td className="px-6 py-4 font-medium text-muted-foreground">#{ticket.id}</td>
                    <td className="px-6 py-4 font-bold text-foreground">{ticket.unit}</td>
                    <td className="px-6 py-4">{ticket.reported_by}</td>
                    <td className="px-6 py-4 font-medium max-w-xs truncate" title={ticket.issue}>{ticket.issue}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-[10px] font-bold tracking-wider uppercase
                        ${ticket.priority === 'High' ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-400' : ''}
                        ${ticket.priority === 'Medium' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-400' : ''}
                        ${ticket.priority === 'Low' ? 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400' : ''}
                      `}>
                        {ticket.priority || 'Medium'}
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
                    <td className="px-6 py-4 space-x-2">
                      <Button variant="ghost" size="icon-sm" onClick={() => {
                        setTicketToView(ticket);
                        setIsViewModalOpen(true);
                      }} title="View Ticket Details">
                        <MaterialIcon name="visibility" className="text-muted-foreground hover:text-primary" />
                      </Button>
                      
                      {ticket.photo_url && (
                        <Button variant="outline" size="sm" onClick={() => {
                          setPhotoToView(ticket.photo_url);
                          setIsPhotoModalOpen(true);
                        }} title="View attached photo">
                          <MaterialIcon name="image" className="text-blue-500" />
                        </Button>
                      )}
                      
                      {user?.role === 'admin' && (
                        <>
                          {ticket.status === 'New' && (
                            <Button variant="outline" size="sm" onClick={() => handleUpdateStatus(ticket.id, 'In Progress')} title="Mark as In Progress">
                              <MaterialIcon name="pending_actions" className="text-amber-500" />
                            </Button>
                          )}
                          {ticket.status === 'In Progress' && (
                            <Button variant="outline" size="sm" onClick={() => handleUpdateStatus(ticket.id, 'Resolved')} title="Mark as Resolved">
                              <MaterialIcon name="check_circle" className="text-emerald-500" />
                            </Button>
                          )}
                          <Button variant="outline" size="sm" className="hover:bg-rose-100 hover:text-rose-600 dark:hover:bg-rose-900" onClick={() => {
                            setTicketToDelete(ticket);
                            setIsDeleteDialogOpen(true);
                          }} title="Delete Ticket">
                            <MaterialIcon name="delete" className="text-rose-500" />
                          </Button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
                {mockMaintenance.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-6 py-8 text-center text-muted-foreground">
                      No maintenance tickets found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* View Ticket Details Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Ticket Details: #{ticketToView?.id}</DialogTitle>
          </DialogHeader>
          {ticketToView && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Reported By</p>
                  <p className="font-semibold">{ticketToView.reported_by}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Unit</p>
                  <p className="font-semibold">{ticketToView.unit}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Date</p>
                  <p className="font-semibold">{ticketToView.date}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Priority & Status</p>
                  <p className="font-semibold">{ticketToView.priority} - {ticketToView.status}</p>
                </div>
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Issue Description</p>
                <p className="mt-1 text-sm bg-muted/30 p-3 rounded-md">{ticketToView.issue}</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewModalOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Ticket</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Are you sure you want to delete maintenance ticket <strong>#{ticketToDelete?.id}</strong>?</p>
            <p className="text-sm text-muted-foreground mt-2">This action cannot be undone and will remove the record permanently.</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete}>Delete Ticket</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Photo View Dialog */}
      <Dialog open={isPhotoModalOpen} onOpenChange={setIsPhotoModalOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Issue Photo Attachment</DialogTitle>
          </DialogHeader>
          <div className="py-4 flex justify-center bg-muted/30 rounded-lg">
            {photoToView ? (
              <img src={photoToView} alt="Maintenance Issue" className="max-w-full max-h-[60vh] object-contain rounded-md" />
            ) : (
              <p className="text-muted-foreground">No photo attached.</p>
            )}
          </div>
          <DialogFooter>
            <Button onClick={() => setIsPhotoModalOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}
