
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getUserBookings, getRooms, getUserProfile } from "@/lib/firebase-service";
import { format } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

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

  return (
    <div className="flex flex-col gap-8">
        <h1 className="text-3xl font-bold">My Dashboard</h1>

        <div className="grid gap-8 md:grid-cols-3">
            <div className="md:col-span-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Upcoming Stays</CardTitle>
                        <CardDescription>Here are your confirmed bookings.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {userBookings.filter(b => b.status === 'Confirmed').map((booking) => {
                             const room = rooms.find(r => r.name === booking.roomName);
                             return (
                                <div key={booking.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                                    {room && (
                                        <Image 
                                            src={room.images?.[0]?.url || 'https://placehold.co/100x100.png'}
                                            alt={room.name}
                                            width={100}
                                            height={100}
                                            className="rounded-md object-cover w-24 h-24"
                                            data-ai-hint={room.images?.[0]?.hint}
                                        />
                                    )}
                                    <div className="flex-grow">
                                        <h3 className="font-semibold">{booking.roomName}</h3>
                                        <p className="text-sm text-muted-foreground">
                                            {format(booking.checkIn, 'PPP')} - {format(booking.checkOut, 'PPP')}
                                        </p>
                                        <p className="text-sm font-bold mt-2">${booking.total.toFixed(2)}</p>
                                    </div>
                                    <Button variant="outline" size="sm">Manage</Button>
                                </div>
                             )
                        })}
                         {userBookings.filter(b => b.status === 'Confirmed').length === 0 && (
                            <div className="text-center py-8">
                                <p className="text-muted-foreground">You have no upcoming stays.</p>
                                <Button asChild className="mt-4">
                                    <Link href="/rooms">Book a Room</Link>
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
            <div>
                <Card>
                    <CardHeader className="items-center text-center">
                        <Avatar className="w-24 h-24 mb-4">
                            <AvatarImage src={user.avatar} alt={user.name} data-ai-hint="person" />
                            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <CardTitle>{user.name}</CardTitle>
                        <CardDescription>{user.email}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col space-y-2">
                         <Button asChild>
                            <Link href="/dashboard/profile">Edit Profile</Link>
                         </Button>
                         <Button variant="outline">View Booking History</Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    </div>
  );
}
