
import { getUserBookings, getRooms, getUserProfile } from "@/lib/firebase-service";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { UserDashboard } from "@/components/dashboard/UserDashboard";
import type { UserProfile } from "@/lib/types";

export default async function UserDashboardPage() {
    const session = await getSession();
    if (!session) {
        redirect('/login');
    }

    if (session.role === 'admin') {
        redirect('/dashboard/admin');
    }

    const [user, userBookings, rooms] = await Promise.all([
        getUserProfile(session), 
        getUserBookings(session), 
        getRooms()
    ]);
    
    if (!user) {
        return (
            <div>
                User not found.
            </div>
        )
    }

  return <UserDashboard user={user} userBookings={userBookings} rooms={rooms} />;
}
