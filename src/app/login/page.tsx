import { GuestLoginForm } from "@/components/auth/GuestLoginForm";
import { AdminLoginForm } from "@/components/auth/AdminLoginForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle, Shield, User } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function LoginPage({ searchParams }: { searchParams?: { [key: string]: string | string[] | undefined } }) {
  const bookingSuccess = searchParams?.booking === 'success';

  return (
    <div className="container mx-auto flex items-center justify-center min-h-[calc(100vh-8rem)] py-12">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-headline">Welcome Back</CardTitle>
          <CardDescription>Log in to access your dashboard and manage your stay.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {bookingSuccess && (
            <Alert className="border-green-500 bg-green-50 text-green-900 dark:bg-green-900/20 dark:text-green-200 dark:border-green-800">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <AlertTitle className="font-semibold">Booking Successful!</AlertTitle>
                <AlertDescription>
                    Your room is reserved. Please log in to view your booking details.
                </AlertDescription>
            </Alert>
          )}
          
          <div className="p-6 border rounded-lg">
             <div className="flex items-center gap-3 mb-4">
                <User className="w-6 h-6 text-primary" />
                <h3 className="text-lg font-headline">Guest Login</h3>
             </div>
             <p className="text-sm text-muted-foreground mb-4">
                Access your booking details using the information you provided during your reservation.
             </p>
             <GuestLoginForm />
          </div>

          <div className="relative">
            <Separator />
            <div className="absolute inset-0 flex items-center">
                <span className="mx-auto bg-background px-4 text-xs uppercase text-muted-foreground">Or</span>
            </div>
          </div>

          <div className="p-6 border rounded-lg">
            <div className="flex items-center gap-3 mb-4">
                <Shield className="w-6 h-6 text-primary" />
                <h3 className="text-lg font-headline">Admin Login</h3>
             </div>
             <p className="text-sm text-muted-foreground mb-4">
                Access the administrative dashboard to manage the hotel.
             </p>
            <AdminLoginForm />
          </div>

        </CardContent>
      </Card>
    </div>
  );
}
