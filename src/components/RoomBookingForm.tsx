
"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { format, differenceInDays } from "date-fns"
import { Calendar as CalendarIcon, Loader2, Info, Terminal } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import { Calendar } from "./ui/calendar"
import { cn } from "@/lib/utils"
import { createBookingAction } from "@/lib/actions"
import type { Room } from "@/lib/types"
import { Alert, AlertTitle, AlertDescription } from "./ui/alert"

const formSchema = z.object({
  guestName: z.string().min(2, { message: "Name must be at least 2 characters." }),
  guestIdNumber: z.string().min(4, { message: "ID number seems too short." }),
  phoneNumber: z.string().min(10, { message: "Please enter a valid phone number." }),
  checkIn: z.date({ required_error: "Check-in date is required." }),
  checkOut: z.date({ required_error: "Check-out date is required." }),
}).refine(data => data.checkOut > data.checkIn, {
    message: "Check-out date must be after check-in date.",
    path: ["checkOut"],
});

export function RoomBookingForm({ room, isOccupied }: { room: Room, isOccupied?: boolean }) {
    const [loading, setLoading] = React.useState(false);
    const [total, setTotal] = React.useState(0);
    const [error, setError] = React.useState<string | null>(null);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            guestName: "",
            guestIdNumber: "",
            phoneNumber: "",
        },
    });

    const { watch } = form;
    const checkInDate = watch("checkIn");
    const checkOutDate = watch("checkOut");

    React.useEffect(() => {
        if (checkInDate && checkOutDate && checkOutDate > checkInDate) {
            const nights = differenceInDays(checkOutDate, checkInDate);
            setTotal(nights * room.price);
        } else {
            setTotal(0);
        }
    }, [checkInDate, checkOutDate, room.price]);

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setLoading(true);
        setError(null);

        const bookingData = {
            ...values,
            roomId: room.id,
            roomName: room.name,
            total,
        }

        const result = await createBookingAction(bookingData);

        if (result?.error) {
            setError(result.error);
        }
        // On success, the action redirects, so no success toast is needed here.
        setLoading(false);
    }
    
    if (isOccupied) {
        return (
            <Card className="shadow-lg sticky top-24">
                <CardHeader>
                    <CardTitle className="font-headline text-2xl">Reserve Your Stay</CardTitle>
                </CardHeader>
                <CardContent>
                    <Alert variant="destructive">
                        <Info className="h-4 w-4" />
                        <AlertTitle>Currently Occupied</AlertTitle>
                        <AlertDescription>
                            This room is occupied today. Please check back later or search for different dates.
                        </AlertDescription>
                    </Alert>
                </CardContent>
            </Card>
        );
    }


  return (
    <Card className="shadow-lg sticky top-24">
        <CardHeader>
            <CardTitle className="font-headline text-2xl">Reserve Your Stay</CardTitle>
            <CardDescription>Fill out the form below to book this room.</CardDescription>
        </CardHeader>
        <CardContent>
            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField control={form.control} name="guestName" render={({ field }) => (
                    <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input placeholder="John Doe" {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
                <div className="grid grid-cols-2 gap-4">
                    <FormField control={form.control} name="guestIdNumber" render={({ field }) => (
                        <FormItem><FormLabel>ID Number</FormLabel><FormControl><Input placeholder="e.g., Passport #" {...field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                    <FormField control={form.control} name="phoneNumber" render={({ field }) => (
                        <FormItem><FormLabel>Phone Number</FormLabel><FormControl><Input placeholder="(555) 000-0000" {...field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                </div>
                 <div className="grid grid-cols-2 gap-4">
                    <FormField control={form.control} name="checkIn" render={({ field }) => (
                        <FormItem className="flex flex-col"><FormLabel>Check-in Date</FormLabel>
                        <Popover>
                            <PopoverTrigger asChild>
                            <FormControl>
                                <Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                                {field.value ? (format(field.value, "PPP")) : (<span>Pick a date</span>)}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                            </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))} initialFocus />
                            </PopoverContent>
                        </Popover><FormMessage /></FormItem>
                    )}/>
                    <FormField control={form.control} name="checkOut" render={({ field }) => (
                        <FormItem className="flex flex-col"><FormLabel>Check-out Date</FormLabel>
                        <Popover>
                            <PopoverTrigger asChild>
                            <FormControl>
                                <Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                                {field.value ? (format(field.value, "PPP")) : (<span>Pick a date</span>)}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                            </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date <= (checkInDate || new Date())} initialFocus />
                            </PopoverContent>
                        </Popover><FormMessage /></FormItem>
                    )}/>
                 </div>
                {total > 0 && (
                    <div className="p-4 bg-secondary rounded-lg text-center">
                        <p className="text-sm text-muted-foreground">Estimated Total</p>
                        <p className="text-2xl font-bold text-primary">${total.toFixed(2)}</p>
                    </div>
                )}
                 {error && (
                    <Alert variant="destructive">
                        <Terminal className="h-4 w-4" />
                        <AlertTitle>Booking Failed</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}
                <Button type="submit" className="w-full" disabled={loading}>
                    {loading && <Loader2 className="animate-spin mr-2" />}
                    Book Now
                </Button>
            </form>
            </Form>
        </CardContent>
    </Card>
  )
}
