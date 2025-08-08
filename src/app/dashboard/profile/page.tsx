import { getSession } from "@/lib/auth";
import { getUserProfile } from "@/lib/firebase-service";
import { redirect } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ProfileForm } from "@/components/dashboard/ProfileForm";

export default async function ProfilePage() {
    const session = await getSession();
    if (!session) {
        redirect('/login');
    }

    const user = await getUserProfile(session);
    if (!user) {
        return (
            <div>
                User not found.
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-8">
            <h1 className="text-3xl font-bold">My Profile</h1>
            <Card>
                <CardHeader className="flex flex-row items-start gap-6 space-y-0">
                    <Avatar className="w-24 h-24">
                        <AvatarImage src={user.avatar ?? undefined} alt={user.name} />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-grow">
                        <CardTitle className="text-2xl">{user.name}</CardTitle>
                        <CardDescription>{user.email}</CardDescription>
                    </div>
                </CardHeader>
                <CardContent>
                    <ProfileForm user={user} session={session} />
                </CardContent>
            </Card>
        </div>
    );
}
