
// src/components/layout/NotificationBell.tsx
"use client";

import { useEffect, useState, useRef } from "react";
import { Bell, MessageSquare, CalendarCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { db } from "@/lib/firebase";
import { collection, query, where, onSnapshot, orderBy } from "firebase/firestore";
import type { Notification, SessionPayload } from "@/lib/types";
import { markNotificationsAsReadAction } from "@/lib/actions";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { parseDocWithDateConversion } from "@/lib/firebase-service";


export function NotificationBell({ session }: { session: SessionPayload }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const { toast } = useToast();
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (!session?.userId) return;

    const q = query(
        collection(db, "notifications"), 
        where("userId", "==", session.userId),
        orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
        const newNotifications = snapshot.docs.map(doc => parseDocWithDateConversion<Notification>(doc));
      
        setNotifications(prevNotifications => {
            if (isInitialMount.current) {
                isInitialMount.current = false;
            } else {
                // Determine what's new *after* this state update.
                // We'll use a separate effect to show the toast.
                setTimeout(() => {
                    const newlyAdded = newNotifications.filter(
                        newNotif => !prevNotifications.some(oldNotif => oldNotif.id === newNotif.id)
                    );

                    newlyAdded.forEach(notification => {
                        if (!notification.isRead) {
                            toast({
                                title: "New Notification",
                                description: notification.message
                            });
                        }
                    });
                }, 0);
            }
            return newNotifications;
        });

        setUnreadCount(newNotifications.filter(n => !n.isRead).length);
    });

    return () => unsubscribe();
  }, [session?.userId, toast]);

  const handleOpenChange = async (open: boolean) => {
    setIsPopoverOpen(open);
    if (open && unreadCount > 0) {
      // Mark as read on the backend
      await markNotificationsAsReadAction(session.userId);
      // Optimistically update the UI
      setUnreadCount(0);
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    }
  };

  const getNotificationIcon = (href: string) => {
    if (href.includes('bookings')) return CalendarCheck;
    if (href.includes('messages')) return MessageSquare;
    return Bell;
  }

  return (
    <Popover open={isPopoverOpen} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <div className="absolute top-0 right-0 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              {unreadCount}
            </div>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Notifications</h4>
            <p className="text-sm text-muted-foreground">
              You have {notifications.length} total notifications.
            </p>
          </div>
          <div className="grid gap-2">
            {notifications.length > 0 ? (
              notifications.slice(0, 5).map((notification) => {
                const Icon = getNotificationIcon(notification.href);
                return (
                    <Link key={notification.id} href={notification.href} className="-m-2 flex items-start space-x-4 rounded-md p-2 transition-all hover:bg-accent hover:text-accent-foreground" onClick={() => setIsPopoverOpen(false)}>
                        <Icon className="mt-px h-5 w-5" />
                        <div className="space-y-1">
                            <p className="text-sm font-medium leading-none">
                            {notification.message}
                            </p>
                            <p className="text-sm text-muted-foreground">
                            {formatDistanceToNow(notification.createdAt, { addSuffix: true })}
                            </p>
                        </div>
                    </Link>
                )
              })
            ) : (
              <p className="text-sm text-center text-muted-foreground py-4">No notifications yet.</p>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
