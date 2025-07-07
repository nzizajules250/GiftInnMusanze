import { getSession } from "@/lib/auth";
import { getUserProfile } from "@/lib/firebase-service";
import { redirect } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { SettingsForm } from "@/components/dashboard/settings/SettingsForm";

export default async function SettingsPage() {
    const session = await getSession();
    if (!session) {
        redirect('/login');
    }

    // In a real app, you'd fetch user settings from the database
    const userSettings = {
        emailNotifications: true,
        pushNotifications: false,
    };

    return (
        <div className="flex flex-col gap-8">
            <h1 className="text-3xl font-bold">Settings</h1>
            <Card>
                <CardHeader>
                    <CardTitle>Notification Settings</CardTitle>
                    <CardDescription>Manage how you receive notifications from Gift Inn.</CardDescription>
                </CardHeader>
                <CardContent>
                    <SettingsForm userSettings={userSettings} />
                </CardContent>
            </Card>
        </div>
    );
}
