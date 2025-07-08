// src/components/dashboard/admin/RecentActivityFeed.tsx
"use client";

import type { Notification } from "@/lib/types";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Bell, CalendarCheck, MessageSquare } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const getNotificationIcon = (href: string) => {
    if (href.includes('booking')) return CalendarCheck;
    if (href.includes('message')) return MessageSquare;
    return Bell;
}

export function RecentActivityFeed({ activities }: { activities: Notification[] }) {
  return (
    <Card className="h-full">
        <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>A log of recent admin actions and site events.</CardDescription>
        </CardHeader>
        <CardContent>
            {activities.length > 0 ? (
                <div className="space-y-4">
                    {activities.map((activity) => {
                        const Icon = getNotificationIcon(activity.href);
                        return (
                            <Link key={activity.id} href={activity.href} className="flex items-start gap-4 hover:bg-secondary p-2 -m-2 rounded-lg transition-colors">
                                <div className="bg-muted p-2 rounded-full mt-1">
                                  <Icon className="w-5 h-5 text-muted-foreground" />
                                </div>
                                <div className="flex-grow">
                                    <p className="text-sm leading-snug">{activity.message}</p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        {formatDistanceToNow(activity.createdAt, { addSuffix: true })}
                                    </p>
                                </div>
                            </Link>
                        )
                    })}
                </div>
            ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground text-center py-8">
                     <p>No recent activity to display.</p>
                </div>
            )}
        </CardContent>
    </Card>
  );
}
