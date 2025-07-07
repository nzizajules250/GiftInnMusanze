import { LoginTabs } from "@/components/auth/LoginTabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle } from "lucide-react";

export default function LoginPage({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  const bookingSuccess = searchParams?.booking === 'success';

  return (
    <div className="container mx-auto flex items-center justify-center min-h-[calc(100vh-8rem)] py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-headline">Welcome Back</CardTitle>
          <CardDescription>Select your login method to access your dashboard.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {bookingSuccess && (
            <Alert className="border-green-500 bg-green-50 text-green-900">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <AlertTitle className="font-semibold">Booking Successful!</AlertTitle>
                <AlertDescription>
                    Your room is reserved. Please log in to view your booking details.
                </AlertDescription>
            </Alert>
          )}
          <LoginTabs />
        </CardContent>
      </Card>
    </div>
  );
}
