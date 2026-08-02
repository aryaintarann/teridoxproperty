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
import { motion } from "framer-motion";

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
    <div className="min-h-screen bg-background flex flex-col justify-center relative overflow-hidden font-sans selection:bg-primary selection:text-primary-foreground">
      {/* Background decoration - Glowing Orbs */}
      <div className="absolute top-0 right-0 w-[600px] md:w-[800px] h-[600px] md:h-[800px] bg-primary/10 rounded-full blur-[100px] md:blur-[120px] pointer-events-none -translate-y-1/2 translate-x-1/3 mix-blend-screen" />
      <div className="absolute bottom-0 left-0 w-[500px] md:w-[600px] h-[500px] md:h-[600px] bg-secondary/30 rounded-full blur-[80px] pointer-events-none translate-y-1/3 -translate-x-1/4 mix-blend-multiply dark:mix-blend-screen" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="container mx-auto px-6 relative z-10 flex flex-col items-center"
      >
        <Link href="/" className="mb-8 flex items-center text-xs font-bold tracking-widest uppercase text-muted-foreground hover:text-primary transition-colors">
          <MaterialIcon name="arrow_back" className="text-sm mr-2" />
          Kembali ke Beranda
        </Link>

        <div className="flex items-center gap-3 mb-10 group cursor-pointer" onClick={() => router.push('/')}>
          <div className="w-12 h-12 bg-primary rounded-[1rem] flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
            <MaterialIcon name="apartment" className="text-primary-foreground text-3xl" filled />
          </div>
          <div className="text-3xl font-heading font-bold text-foreground tracking-tight">
            Teridox Property
          </div>
        </div>

        <Card className="w-full max-w-md shadow-2xl border-border/50 glass-card rounded-[2rem] overflow-hidden">
          <CardHeader className="text-center pb-4 pt-10">
            <CardTitle className="font-heading text-3xl text-foreground font-bold">
              <SplitText text="Selamat Datang" />
            </CardTitle>
            <CardDescription className="text-muted-foreground text-base mt-2">Silakan masuk ke portal Anda</CardDescription>
          </CardHeader>
          <CardContent className="px-8 pb-8">
            <Tabs defaultValue="tenant" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8 bg-muted/50 p-1 rounded-xl">
                <TabsTrigger 
                  value="tenant" 
                  className="rounded-lg data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm text-xs font-bold tracking-widest uppercase py-2.5 transition-all"
                >
                  Penghuni
                </TabsTrigger>
                <TabsTrigger 
                  value="admin"
                  className="rounded-lg data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm text-xs font-bold tracking-widest uppercase py-2.5 transition-all"
                >
                  Admin
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="tenant" className="mt-0">
                <motion.form 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  onSubmit={(e) => handleLogin(e, 'tenant')} 
                  className="space-y-5"
                >
                  <div className="space-y-2">
                    <Label htmlFor="email-tenant" className="text-xs font-bold tracking-widest text-muted-foreground">EMAIL</Label>
                    <Input 
                      id="email-tenant" 
                      type="email" 
                      placeholder="nama@email.com" 
                      required 
                      className="h-12 bg-background/50 border-border/50 focus-visible:ring-primary/30 focus-visible:border-primary rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label htmlFor="password-tenant" className="text-xs font-bold tracking-widest text-muted-foreground">PASSWORD</Label>
                      <Link href="#" className="text-xs text-primary hover:underline font-semibold">Lupa Password?</Link>
                    </div>
                    <Input 
                      id="password-tenant" 
                      type="password" 
                      required 
                      className="h-12 bg-background/50 border-border/50 focus-visible:ring-primary/30 focus-visible:border-primary rounded-xl"
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full h-12 bg-primary text-primary-foreground hover:opacity-90 hover-bouncy text-xs font-bold tracking-widest uppercase mt-4 rounded-xl shadow-lg" 
                    disabled={isLoading}
                  >
                    {isLoading ? "Memproses..." : "Masuk sebagai Penghuni"}
                  </Button>
                </motion.form>
              </TabsContent>
              
              <TabsContent value="admin" className="mt-0">
                <motion.form 
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  onSubmit={(e) => handleLogin(e, 'admin')} 
                  className="space-y-5"
                >
                  <div className="space-y-2">
                    <Label htmlFor="email-admin" className="text-xs font-bold tracking-widest text-muted-foreground">EMAIL ADMIN</Label>
                    <Input 
                      id="email-admin" 
                      type="email" 
                      placeholder="admin@teridox.com" 
                      required 
                      className="h-12 bg-background/50 border-border/50 focus-visible:ring-primary/30 focus-visible:border-primary rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password-admin" className="text-xs font-bold tracking-widest text-muted-foreground">PASSWORD</Label>
                    <Input 
                      id="password-admin" 
                      type="password" 
                      required 
                      className="h-12 bg-background/50 border-border/50 focus-visible:ring-primary/30 focus-visible:border-primary rounded-xl"
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full h-12 bg-foreground text-background hover:opacity-90 hover-bouncy text-xs font-bold tracking-widest uppercase mt-4 rounded-xl shadow-lg" 
                    disabled={isLoading}
                  >
                    {isLoading ? "Memproses..." : "Masuk sebagai Admin"}
                  </Button>
                </motion.form>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-center border-t border-border/40 py-6 bg-muted/20">
            <p className="text-sm text-muted-foreground text-center">
              Belum memiliki akun portal? <br className="sm:hidden" />
              <Link href="#" className="text-primary font-bold hover:underline ml-1">
                Hubungi Manajer Properti
              </Link>
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
