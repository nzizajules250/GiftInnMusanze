// src/components/dashboard/admin/MessagesTab.tsx
"use client";

import { useState } from "react";
import type { ContactMessage } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { format } from "date-fns";
import { markMessageAsReadAction } from "@/lib/actions";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

export function MessagesTab({ messages: initialMessages }: { messages: ContactMessage[] }) {
    const [messages, setMessages] = useState(initialMessages);
    const { toast } = useToast();

    const handleMarkAsRead = async (messageId: string) => {
        const result = await markMessageAsReadAction(messageId);
        if (result.success) {
            setMessages(prev => prev.map(m => m.id === messageId ? { ...m, isRead: true } : m));
            toast({ title: "Message marked as read." });
        } else {
            toast({ title: "Error", description: result.error, variant: "destructive" });
        }
    };
    
    const sortedMessages = [...messages].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    return (
        <Card>
            <CardHeader>
                <CardTitle>Inbox</CardTitle>
                <CardDescription>Messages from the website contact form.</CardDescription>
            </CardHeader>
            <CardContent>
                <Accordion type="multiple" className="w-full">
                    {sortedMessages.map((message) => (
                        <AccordionItem value={message.id} key={message.id}>
                            <AccordionTrigger className="w-full text-left hover:no-underline">
                               <div className="flex flex-col items-start gap-1 sm:flex-row sm:items-center justify-between w-full pr-4">
                                    <div className="flex items-center gap-2 truncate">
                                        {!message.isRead && <Badge variant="destructive">New</Badge>}
                                        <span className="font-semibold truncate">{message.name}</span>
                                        <span className="text-muted-foreground hidden md:inline truncate">{message.email}</span>
                                    </div>
                                    <span className="text-sm text-muted-foreground flex-shrink-0">{format(message.createdAt, "PP p")}</span>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent>
                                <div className="p-4 bg-muted/50 rounded-lg">
                                    <p className="whitespace-pre-wrap">{message.message}</p>
                                    {!message.isRead && (
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="mt-4"
                                            onClick={() => handleMarkAsRead(message.id)}
                                        >
                                            Mark as Read
                                        </Button>
                                    )}
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
                {messages.length === 0 && (
                    <p className="text-center text-muted-foreground py-8">No messages yet.</p>
                )}
            </CardContent>
        </Card>
    );
}
