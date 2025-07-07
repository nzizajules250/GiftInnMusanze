import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getUserBookings, getRooms } from "@/lib/firebase-service";
import { format } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default async function UserDashboardPage() {
    const user = {
        name: "Alex Doe",
        email: "alex.doe@example.com",
        avatar: "https://placehold.co/100x100.png"
    }
    const [userBookings, rooms] = await Promise.all([getUserBookings(), getRooms()]);

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
                                            src={room.image}
                                            alt={room.name}
                                            width={100}
                                            height={100}
                                            className="rounded-md object-cover w-24 h-24"
                                            data-ai-hint={room.hint}
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
                            <p className="text-muted-foreground text-center py-8">You have no upcoming stays.</p>
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
