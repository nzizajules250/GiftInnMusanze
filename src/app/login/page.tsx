import { LoginTabs } from "@/components/auth/LoginTabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function LoginPage() {
  return (
    <div className="container mx-auto flex items-center justify-center min-h-[calc(100vh-8rem)] py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-headline">Welcome Back</CardTitle>
          <CardDescription>Select your login method to access your dashboard.</CardDescription>
        </CardHeader>
        <CardContent>
          <LoginTabs />
        </CardContent>
      </Card>
    </div>
  );
}
