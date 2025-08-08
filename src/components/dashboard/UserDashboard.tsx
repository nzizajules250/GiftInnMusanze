"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { cancelUserBookingAction } from "@/lib/actions";
import { DeleteConfirmationDialog } from "@/components/dashboard/admin/DeleteConfirmationDialog";
import type { Booking, Room, UserProfile } from "@/lib/types";
import { BookingConfirmation } from "./BookingConfirmation";

interface UserDashboardProps {
    user: UserProfile;
    userBookings: Booking[];
    rooms: Room[];
}

export function UserDashboard({ user, userBookings, rooms }: UserDashboardProps) {
    const [deletingBooking, setDeletingBooking] = useState<Booking | null>(null);
    const { toast } = useToast();

    const handleCancelBooking = async () => {
        if (!deletingBooking) return;
        const result = await cancelUserBookingAction(deletingBooking.id);
        if (result.success) {
            toast({ title: "Booking Cancelled", description: "Your booking has been successfully cancelled." });
        } else {
            toast({ title: "Error", description: result.error, variant: "destructive" });
        }
        setDeletingBooking(null);
    };

    return (
        <>
            <div className="flex flex-col gap-8">
                <h1 className="text-3xl font-bold">My Dashboard</h1>
                <div className="grid gap-8 md:grid-cols-3">
                    <div className="md:col-span-2 space-y-8">
                        <Card>
                            <CardHeader>
                                <CardTitle>My Bookings</CardTitle>
                                <CardDescription>Here are your recent bookings.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {userBookings.map((booking) => {
                                    const room = rooms.find(r => r.name === booking.roomName);
                                    const canCancel = booking.status === 'Pending' || booking.status === 'Confirmed';
                                    return (
                                        <div key={booking.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                                            {room && (
                                                <Image
                                                    src={room.images?.[0]?.url || 'https://placehold.co/100x100.png'}
                                                    alt={room.name}
                                                    width={100}
                                                    height={100}
                                                    className="rounded-md object-cover w-24 h-24"
                                                />
                                            )}
                                            <div className="flex-grow">
                                                <h3 className="font-semibold">{booking.roomName}</h3>
                                                <p className="text-sm text-muted-foreground">
                                                    {format(booking.checkIn, 'PPP')} - {format(booking.checkOut, 'PPP')}
                                                </p>
                                                <p className="text-sm font-bold mt-2 text-primary">${booking.total.toFixed(2)}</p>
                                            </div>
                                            <div className="flex flex-col items-end gap-2">
                                                <Badge variant={booking.status === 'Confirmed' ? 'default' : booking.status === 'Cancelled' ? 'destructive' : 'secondary'}>
                                                    {booking.status}
                                                </Badge>
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    disabled={!canCancel}
                                                    onClick={() => canCancel && setDeletingBooking(booking)}
                                                >
                                                    Cancel Booking
                                                </Button>
                                            </div>
                                        </div>
                                    )
                                })}
                                {userBookings.length === 0 && (
                                    <div className="text-center py-8">
                                        <p className="text-muted-foreground">You have no bookings yet.</p>
                                        <Button asChild className="mt-4">
                                            <Link href="/rooms">Book a Room</Link>
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                        {userBookings.length > 0 && <BookingConfirmation />}
                    </div>
                    <div>
                        <Card>
                            <CardHeader className="items-center text-center">
                                <Avatar className="w-24 h-24 mb-4">
                                    <AvatarImage src={user.avatar ?? undefined} alt={user.name} />
                                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <CardTitle>{user.name}</CardTitle>
                                <CardDescription>{user.email}</CardDescription>
                            </CardHeader>
                            <CardFooter className="flex flex-col space-y-2">
                                <Button asChild className="w-full">
                                    <Link href="/dashboard/profile">Edit Profile</Link>
                                </Button>
                                <Button variant="outline" className="w-full" disabled>View Booking History</Button>
                            </CardFooter>
                        </Card>
                    </div>
                </div>
            </div>
            <DeleteConfirmationDialog
                isOpen={!!deletingBooking}
                setIsOpen={() => setDeletingBooking(null)}
                onConfirm={handleCancelBooking}
                itemType="booking"
                title="Are you sure you want to cancel?"
                description="This action cannot be undone. This will cancel your booking. Please contact support if you need to rebook."
            />
        </>
    );
}
