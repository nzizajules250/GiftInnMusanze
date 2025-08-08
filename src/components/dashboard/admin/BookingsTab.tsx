"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import type { Booking } from "@/lib/types";
import { updateBookingStatusAction } from "@/lib/actions";

export function BookingsTab({ bookings }: { bookings: Booking[] }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>All Bookings</CardTitle>
                <CardDescription>A complete list of all bookings made.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Guest</TableHead>
                            <TableHead className="hidden md:table-cell">Room</TableHead>
                            <TableHead className="hidden lg:table-cell">Dates</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Amount</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {bookings.map((booking) => (
                            <TableRow key={booking.id}>
                                <TableCell>
                                    <div className="font-medium">{booking.guestName}</div>
                                    <div className="text-sm text-muted-foreground hidden sm:inline">{booking.id}</div>
                                </TableCell>
                                <TableCell className="hidden md:table-cell">{booking.roomName}</TableCell>
                                <TableCell className="hidden lg:table-cell">{`${format(booking.checkIn, 'PP')} to ${format(booking.checkOut, 'PP')}`}</TableCell>
                                <TableCell>
                                    <Badge variant={booking.status === 'Confirmed' ? 'default' : booking.status === 'Cancelled' ? 'destructive' : 'secondary'}>
                                        {booking.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">${booking.total.toFixed(2)}</TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <form action={async () => await updateBookingStatusAction(booking.id, 'Confirmed')}>
                                            <Button type="submit" size="sm" variant="outline" disabled={booking.status === 'Confirmed'}>
                                                Confirm
                                            </Button>
                                        </form>
                                        <form action={async () => await updateBookingStatusAction(booking.id, 'Cancelled')}>
                                            <Button type="submit" size="sm" variant="destructive" disabled={booking.status === 'Cancelled'}>
                                                Cancel
                                            </Button>
                                        </form>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
