import { StatCard } from "@/components/dashboard/StatCard";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { DollarSign, BedDouble, CalendarCheck, MessageSquare } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getRooms, getAmenities, getBookings, getMessagesForAdmin, getAdminNotifications } from "@/lib/firebase-service";
import { RoomsTab } from "@/components/dashboard/admin/RoomsTab";
import { AmenitiesTab } from "@/components/dashboard/admin/AmenitiesTab";
import { BookingsTab } from "@/components/dashboard/admin/BookingsTab";
import { MessagesTab } from "@/components/dashboard/admin/MessagesTab";
import { RecentActivityFeed } from "@/components/dashboard/admin/RecentActivityFeed";

export default async function AdminDashboardPage() {
    const [rooms, amenities, bookings, messages, adminNotifications] = await Promise.all([
        getRooms(),
        getAmenities(),
        getBookings(),
        getMessagesForAdmin(),
        getAdminNotifications(),
    ]);

    const confirmedBookings = bookings.filter(b => b.status === 'Confirmed');

    const totalRevenue = confirmedBookings.reduce((acc, b) => acc + b.total, 0);
    const unreadMessages = messages.filter(m => !m.isRead).length;

    return (
        <div className="flex flex-col gap-8">
            <h1 className="text-2xl sm:text-3xl font-bold">Admin Dashboard</h1>

            <Tabs defaultValue="overview" className="flex flex-col">
                <div className="w-full overflow-x-auto">
                    <TabsList>
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="rooms">Rooms</TabsTrigger>
                        <TabsTrigger value="amenities">Amenities</TabsTrigger>
                        <TabsTrigger value="bookings">Bookings</TabsTrigger>
                        <TabsTrigger value="messages">
                            Messages {unreadMessages > 0 && <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-0.5">{unreadMessages}</span>}
                        </TabsTrigger>
                    </TabsList>
                </div>

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
                            title="Unread Messages"
                            value={unreadMessages.toString()}
                            icon={MessageSquare}
                            description={`${messages.length} total messages`}
                        />
                        <StatCard
                            title="Manage Rooms"
                            value={rooms.length.toString()}
                            icon={BedDouble}
                            description="Configured room types"
                        />
                    </div>
                     <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-7">
                        <div className="lg:col-span-4">
                            <RevenueChart bookings={bookings} />
                        </div>
                        <div className="lg:col-span-3">
                           <RecentActivityFeed activities={adminNotifications} />
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="rooms" className="mt-4">
                   <RoomsTab rooms={rooms} />
                </TabsContent>

                <TabsContent value="amenities" className="mt-4">
                    <AmenitiesTab amenities={amenities} />
                </TabsContent>

                <TabsContent value="bookings" className="mt-4">
                     <BookingsTab bookings={bookings} />
                </TabsContent>

                 <TabsContent value="messages" className="mt-4">
                     <MessagesTab messages={messages} />
                </TabsContent>
            </Tabs>
        </div>
    );
}
