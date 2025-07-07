import { getSession } from "@/lib/auth";
import { getUserProfile } from "@/lib/firebase-service";
import { redirect } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default async function ProfilePage() {
    const session = await getSession();
    if (!session) {
        redirect('/login');
    }

    const user = await getUserProfile(session);

    return (
        <div className="flex flex-col gap-8">
            <h1 className="text-3xl font-bold">My Profile</h1>
            <Card>
                <CardHeader className="flex flex-row items-start gap-6 space-y-0">
                    <Avatar className="w-24 h-24">
                        <AvatarImage src={user.avatar} alt={user.name} data-ai-hint="person" />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-grow">
                        <CardTitle className="text-2xl">{user.name}</CardTitle>
                        <CardDescription>{user.email}</CardDescription>
                        <Button variant="outline" size="sm" className="mt-4">Change Photo</Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <form className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="name">Full Name</Label>
                                <Input id="name" defaultValue={user.name} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" defaultValue={user.email} disabled />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="current-password">Current Password</Label>
                            <Input id="current-password" type="password" placeholder="Enter current password to change" />
                        </div>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="new-password">New Password</Label>
                                <Input id="new-password" type="password" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="confirm-password">Confirm New Password</Label>
                                <Input id="confirm-password" type="password" />
                            </div>
                        </div>
                        
                    </form>
                </CardContent>
                <CardFooter className="border-t pt-6">
                     <Button>Update Profile</Button>
                </CardFooter>
            </Card>
        </div>
    );
}
