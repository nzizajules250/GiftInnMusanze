import { StatCard } from "@/components/dashboard/StatCard";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { RecentBookings } from "@/components/dashboard/RecentBookings";
import { DollarSign, Users, CreditCard, Activity } from "lucide-react";

export default function AdminDashboardPage() {
  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Total Revenue" 
          value="$45,231.89" 
          icon={DollarSign}
          description="+20.1% from last month"
        />
        <StatCard 
          title="Occupancy"
          value="72%"
          icon={Users}
          description="+12% from last month"
        />
        <StatCard 
          title="New Bookings"
          value="+1,234"
          icon={CreditCard}
          description="+19% from last month"
        />
        <StatCard 
          title="Activity"
          value="+573"
          icon={Activity}
          description="+201 since last hour"
        />
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-7">
        <div className="lg:col-span-4">
          <RevenueChart />
        </div>
        <div className="lg:col-span-3">
          <RecentBookings />
        </div>
      </div>
    </div>
  );
}
