"use client";

import { useState } from "react";
import Link from "next/link";
import { MaterialIcon } from "@/components/ui/material-icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { gooeyToast } from "goey-toast";
import { useRouter } from "next/navigation";
import { SplitText } from "@/components/ui/SplitText";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = (e: React.FormEvent, role: 'admin' | 'tenant') => {
    e.preventDefault();
    setIsLoading(true);

    // Mock login delay
    setTimeout(() => {
      setIsLoading(false);
      gooeyToast.success(`Berhasil login sebagai ${role === 'admin' ? 'Admin' : 'Penghuni'}`);
      
      if (role === 'admin') {
        router.push('/dashboard');
      } else {
        router.push('/dashboard'); // Tenant portal not implemented yet, just redirect to dashboard for now
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-td-surface-bright flex flex-col justify-center relative overflow-hidden font-sans">
      {/* Background decoration - Corporate style */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-td-primary-fixed/20 rounded-full blur-[100px] pointer-events-none -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-td-tertiary-fixed/20 rounded-full blur-[80px] pointer-events-none translate-y-1/3 -translate-x-1/4" />

      <div className="container mx-auto px-6 relative z-10 flex flex-col items-center">
        <Link href="/" className="mb-8 flex items-center text-xs font-semibold tracking-wider uppercase text-td-on-surface-variant hover:text-td-primary transition-colors">
          <MaterialIcon name="arrow_back" className="text-sm mr-2" />
          Kembali ke Beranda
        </Link>

        <div className="flex items-center gap-3 mb-10">
          <div className="w-12 h-12 bg-td-primary rounded-xl flex items-center justify-center shadow-md">
            <MaterialIcon name="apartment" className="text-white text-3xl" filled />
          </div>
          <div className="text-3xl font-heading font-bold text-td-primary tracking-tight">
            Teridox Property
          </div>
        </div>

        <Card className="w-full max-w-md shadow-xl border-td-outline-variant bg-white/95 backdrop-blur-xl rounded-xl">
          <CardHeader className="text-center pb-4 pt-8">
            <CardTitle className="font-heading text-2xl text-td-on-surface">
              <SplitText text="Selamat Datang" />
            </CardTitle>
            <CardDescription className="text-td-on-surface-variant">Silakan masuk ke portal Anda</CardDescription>
          </CardHeader>
          <CardContent className="px-8 pb-8">
            <Tabs defaultValue="tenant" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8 bg-td-surface-container-low p-1 rounded-lg">
                <TabsTrigger 
                  value="tenant" 
                  className="rounded-md data-[state=active]:bg-white data-[state=active]:text-td-primary data-[state=active]:shadow-sm text-xs font-semibold tracking-wider uppercase py-2"
                >
                  Penghuni
                </TabsTrigger>
                <TabsTrigger 
                  value="admin"
                  className="rounded-md data-[state=active]:bg-white data-[state=active]:text-td-primary data-[state=active]:shadow-sm text-xs font-semibold tracking-wider uppercase py-2"
                >
                  Admin
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="tenant">
                <form onSubmit={(e) => handleLogin(e, 'tenant')} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="email-tenant" className="text-xs font-semibold tracking-wider text-td-on-surface-variant">EMAIL</Label>
                    <Input 
                      id="email-tenant" 
                      type="email" 
                      placeholder="nama@email.com" 
                      required 
                      className="h-12 border-td-outline-variant focus-visible:ring-td-primary/20 focus-visible:border-td-primary"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label htmlFor="password-tenant" className="text-xs font-semibold tracking-wider text-td-on-surface-variant">PASSWORD</Label>
                      <Link href="#" className="text-xs text-td-primary hover:underline font-semibold">Lupa Password?</Link>
                    </div>
                    <Input 
                      id="password-tenant" 
                      type="password" 
                      required 
                      className="h-12 border-td-outline-variant focus-visible:ring-td-primary/20 focus-visible:border-td-primary"
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full h-12 bg-td-primary text-white hover:bg-td-primary-container text-xs font-semibold tracking-wider uppercase mt-4" 
                    disabled={isLoading}
                  >
                    {isLoading ? "Memproses..." : "Masuk sebagai Penghuni"}
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="admin">
                <form onSubmit={(e) => handleLogin(e, 'admin')} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="email-admin" className="text-xs font-semibold tracking-wider text-td-on-surface-variant">EMAIL ADMIN</Label>
                    <Input 
                      id="email-admin" 
                      type="email" 
                      placeholder="admin@teridox.com" 
                      required 
                      className="h-12 border-td-outline-variant focus-visible:ring-td-primary/20 focus-visible:border-td-primary"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password-admin" className="text-xs font-semibold tracking-wider text-td-on-surface-variant">PASSWORD</Label>
                    <Input 
                      id="password-admin" 
                      type="password" 
                      required 
                      className="h-12 border-td-outline-variant focus-visible:ring-td-primary/20 focus-visible:border-td-primary"
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full h-12 bg-td-tertiary-container text-td-on-tertiary-container hover:bg-td-tertiary hover:text-white text-xs font-semibold tracking-wider uppercase mt-4" 
                    disabled={isLoading}
                  >
                    {isLoading ? "Memproses..." : "Masuk sebagai Admin"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-center border-t border-td-outline-variant py-6 bg-td-surface-container-lowest/50 rounded-b-xl">
            <p className="text-sm text-td-on-surface-variant text-center">
              Belum memiliki akun portal? <br className="sm:hidden" />
              <Link href="#" className="text-td-primary font-semibold hover:underline ml-1">
                Hubungi Manajer Properti
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
