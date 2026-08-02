"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { availableUnits } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { MaterialIcon } from "@/components/ui/material-icon";
import { gooeyToast } from "goey-toast";

export default function PropertiesPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Properties & Units</h1>
          <p className="text-muted-foreground mt-1">Manage your properties and available units.</p>
        </div>
        <Button onClick={() => gooeyToast.success("Simulated adding new property")}>
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
