"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { Booking } from "@/lib/types"
import { format, getMonth } from "date-fns"

interface RevenueChartProps {
  bookings: Booking[];
}

export function RevenueChart({ bookings }: RevenueChartProps) {
    const monthlyRevenue = Array.from({ length: 12 }, (_, i) => ({
        name: format(new Date(0, i), 'LLL'),
        total: 0,
    }));

    for (const booking of bookings) {
        if (booking.status === 'Confirmed') {
            const month = getMonth(booking.checkIn);
            monthlyRevenue[month].total += booking.total;
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Revenue Overview</CardTitle>
                <CardDescription>Total revenue from confirmed bookings this year.</CardDescription>
            </CardHeader>
            <CardContent>
                 <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={monthlyRevenue}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                            dataKey="name"
                            stroke="hsl(var(--muted-foreground))"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis
                            stroke="hsl(var(--muted-foreground))"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => `$${value}`}
                        />
                        <Tooltip
                            cursor={{fill: 'hsl(var(--muted))'}}
                            contentStyle={{
                                backgroundColor: 'hsl(var(--background))',
                                border: '1px solid hsl(var(--border))',
                                borderRadius: 'var(--radius)'
                            }}
                        />
                        <Bar dataKey="total" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    )
}
