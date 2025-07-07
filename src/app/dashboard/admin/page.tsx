import { StatCard } from "@/components/dashboard/StatCard";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { DollarSign, BedDouble, Sparkles, CalendarCheck } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getRooms, getAmenities, getBookings } from "@/lib/firebase-service";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import Image from "next/image";

export default async function AdminDashboardPage() {
    const [rooms, amenities, bookings] = await Promise.all([
        getRooms(),
        getAmenities(),
        getBookings(),
    ]);

    const confirmedBookings = bookings.filter(b => b.status === 'Confirmed');

    const totalRevenue = confirmedBookings.reduce((acc, b) => acc + b.total, 0);

    return (
        <div className="flex flex-col gap-8">
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>

            <Tabs defaultValue="overview" className="flex flex-col">
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="rooms">Rooms</TabsTrigger>
                    <TabsTrigger value="amenities">Amenities</TabsTrigger>
                    <TabsTrigger value="bookings">Bookings</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4 mt-4">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <StatCard
                            title="Total Revenue"
                            value={`$${totalRevenue.toLocaleString()}`}
                            icon={DollarSign}
                            description="Revenue from confirmed bookings"
                        />
                        <StatCard
                            title="Total Bookings"
                            value={bookings.length.toString()}
                            icon={CalendarCheck}
                            description={`${confirmedBookings.length} bookings are confirmed`}
                        />
                        <StatCard
                            title="Manage Rooms"
                            value={rooms.length.toString()}
                            icon={BedDouble}
                            description="Configured room types"
                        />
                        <StatCard
                            title="Manage Amenities"
                            value={amenities.length.toString()}
                            icon={Sparkles}
                            description="Available amenities"
                        />
                    </div>
                     <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-7">
                        <div className="lg:col-span-4">
                            <RevenueChart bookings={bookings} />
                        </div>
                        <div className="lg:col-span-3">
                           <Card className="h-full">
                               <CardHeader>
                                   <CardTitle>Recent Activity</CardTitle>
                                   <CardDescription>A log of recent admin actions and site events.</CardDescription>
                               </CardHeader>
                               <CardContent>
                                   <p className="text-muted-foreground text-center pt-8">Activity feed coming soon.</p>
                               </CardContent>
                           </Card>
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="rooms" className="mt-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Manage Rooms</CardTitle>
                                <CardDescription>Add, edit, or remove hotel rooms.</CardDescription>
                            </div>
                            <Button>Add New Room</Button>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-24 hidden sm:table-cell">Image</TableHead>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Price</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {rooms.map((room) => (
                                        <TableRow key={room.id}>
                                            <TableCell className="hidden sm:table-cell">
                                                <Image src={room.image} alt={room.name} width={64} height={64} className="rounded-md object-cover" data-ai-hint={room.hint} />
                                            </TableCell>
                                            <TableCell>
                                                <div className="font-medium">{room.name}</div>
                                                <div className="text-sm text-muted-foreground line-clamp-2">{room.description}</div>
                                            </TableCell>
                                            <TableCell>${room.price}/night</TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="outline" size="sm" className="mr-2">Edit</Button>
                                                <Button variant="destructive" size="sm">Delete</Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="amenities" className="mt-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Manage Amenities</CardTitle>
                                <CardDescription>Update hotel amenities and services.</CardDescription>
                            </div>
                            <Button>Add New Amenity</Button>
                        </CardHeader>
                        <CardContent>
                             <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Icon</TableHead>
                                        <TableHead>Title</TableHead>
                                        <TableHead>Description</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {amenities.map((amenity) => {
                                        const Icon = amenity.icon;
                                        return (
                                            <TableRow key={amenity.id}>
                                                <TableCell><Icon className="w-6 h-6" /></TableCell>
                                                <TableCell>{amenity.title}</TableCell>
                                                <TableCell>{amenity.description}</TableCell>
                                                <TableCell className="text-right">
                                                    <Button variant="outline" size="sm" className="mr-2">Edit</Button>
                                                    <Button variant="destructive" size="sm">Delete</Button>
                                                </TableCell>
                                            </TableRow>
                                        )
                                    })}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="bookings" className="mt-4">
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
                                </TableRow>
                                ))}
                            </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
