import { AdminRegisterForm } from "@/components/auth/AdminRegisterForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck } from "lucide-react";

export default function RegisterPage() {
  return (
    <div className="container mx-auto flex items-center justify-center min-h-[calc(100vh-8rem)] py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto bg-primary/20 p-3 rounded-full w-fit mb-2">
            <ShieldCheck className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-headline">Admin Registration</CardTitle>
          <CardDescription>Create a new administrator account with a valid secret code.</CardDescription>
        </CardHeader>
        <CardContent>
          <AdminRegisterForm />
        </CardContent>
      </Card>
    </div>
  );
}
