"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GuestLoginForm } from "./GuestLoginForm";
import { AdminLoginForm } from "./AdminLoginForm";

export function LoginTabs() {
  return (
    <Tabs defaultValue="guest" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="guest">Guest Login</TabsTrigger>
        <TabsTrigger value="admin">Admin Login</TabsTrigger>
      </TabsList>
      <TabsContent value="guest">
        <GuestLoginForm />
      </TabsContent>
      <TabsContent value="admin">
        <AdminLoginForm />
      </TabsContent>
    </Tabs>
  );
}
