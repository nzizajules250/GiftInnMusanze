"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect } from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon, Users } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"

const formSchema = z.object({
  checkIn: z.date().optional(),
  checkOut: z.date().optional(),
  guests: z.string().optional(),
});

interface BookingFormProps {
  isPopover?: boolean;
}

export function BookingForm({ isPopover = false }: BookingFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      guests: searchParams.get('guests') || "2",
      checkIn: searchParams.get('checkIn') ? new Date(searchParams.get('checkIn')!) : undefined,
      checkOut: searchParams.get('checkOut') ? new Date(searchParams.get('checkOut')!) : undefined,
    }
  });

  // Resync form if query params change (e.g., back/forward navigation)
  useEffect(() => {
    form.reset({
      guests: searchParams.get('guests') || "2",
      checkIn: searchParams.get('checkIn') ? new Date(searchParams.get('checkIn')!) : undefined,
      checkOut: searchParams.get('checkOut') ? new Date(searchParams.get('checkOut')!) : undefined,
    })
  }, [searchParams, form]);


  function onSubmit(values: z.infer<typeof formSchema>) {
    const params = new URLSearchParams();
    if (values.checkIn) params.append("checkIn", format(values.checkIn, 'yyyy-MM-dd'));
    if (values.checkOut) params.append("checkOut", format(values.checkOut, 'yyyy-MM-dd'));
    if (values.guests) params.append("guests", values.guests);

    router.push(`/rooms/search?${params.toString()}`);
  }
  
  const checkInDate = form.watch("checkIn");

  const FormContent = (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className={cn(
          "grid items-end gap-4",
          isPopover ? "grid-cols-1" : "grid-cols-1 md:grid-cols-4"
        )}>
           <FormField
              control={form.control}
              name="checkIn"
              render={({ field }) => (
                <FormItem className="flex flex-col space-y-2">
                  <FormLabel>Check-in</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="checkOut"
              render={({ field }) => (
                <FormItem className="flex flex-col space-y-2">
                  <FormLabel>Check-out</FormLabel>
                   <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date <= (checkInDate || new Date())}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </FormItem>
              )}
            />
          <FormField
              control={form.control}
              name="guests"
              render={({ field }) => (
                <FormItem className="flex flex-col space-y-2">
                  <FormLabel>Guests</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <Users className="mr-2 h-4 w-4" />
                        <SelectValue placeholder="Select guests" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="1">1 Guest</SelectItem>
                      <SelectItem value="2">2 Guests</SelectItem>
                      <SelectItem value="3">3 Guests</SelectItem>
                      <SelectItem value="4">4 Guests</SelectItem>
                      <SelectItem value="5">5+ Guests</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
          <Button type="submit" className={cn(!isPopover && "h-10 bg-accent hover:bg-accent/90 text-accent-foreground")}>Check Availability</Button>
        </form>
      </Form>
  )

  if (isPopover) {
      return (
        <div className="p-1">
            {FormContent}
        </div>
      )
  }

  return (
    <Card className="shadow-2xl max-w-4xl mx-auto">
      <CardContent className="p-6">
        {FormContent}
      </CardContent>
    </Card>
  )
}
