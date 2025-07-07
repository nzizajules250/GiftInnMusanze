"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import * as z from "zod";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { saveRoomAction } from "@/lib/actions";
import { Loader2, PlusCircle, Trash2 } from "lucide-react";
import type { Room } from "@/lib/types";
import { ScrollArea } from "@/components/ui/scroll-area";

const imageSchema = z.object({
  url: z.string().url("Please enter a valid image URL."),
  hint: z.string().min(2, "Hint must be at least 2 characters."),
});

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  description: z.string().min(10, "Description must be at least 10 characters."),
  price: z.coerce.number().min(1, "Price must be greater than 0."),
  images: z.array(imageSchema).min(1, "At least one image is required."),
});

interface ManageRoomDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  room: Room | null;
}

export function ManageRoomDialog({ isOpen, setIsOpen, room }: ManageRoomDialogProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      images: [{ url: "https://placehold.co/600x400.png", hint: "" }]
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "images"
  });

  useEffect(() => {
    if (room) {
      form.reset(room);
    } else {
      form.reset({
        name: "",
        description: "",
        price: 0,
        images: [{ url: "https://placehold.co/600x400.png", hint: "" }]
      });
    }
  }, [room, form]);
  
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    const result = await saveRoomAction({ ...values, id: room?.id });
    if (result.success) {
      toast({
        title: room ? "Room Updated" : "Room Added",
        description: `The room "${values.name}" has been saved.`,
      });
      setIsOpen(false);
    } else {
      toast({
        title: "Error",
        description: result.error,
        variant: "destructive",
      });
    }
    setLoading(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{room ? "Edit Room" : "Add New Room"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField control={form.control} name="name" render={({ field }) => (
                <FormItem><FormLabel>Room Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )}/>
            <FormField control={form.control} name="description" render={({ field }) => (
                <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
            )}/>
            <FormField control={form.control} name="price" render={({ field }) => (
                <FormItem><FormLabel>Price per night</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
            )}/>
            
            <div className="space-y-4">
              <FormLabel>Images</FormLabel>
              <ScrollArea className="h-72 w-full rounded-md border">
                <div className="p-4 space-y-2">
                  {fields.map((field, index) => (
                    <div key={field.id} className="flex items-end gap-2 p-3 border rounded-lg bg-muted/50">
                      <div className="flex-grow space-y-2">
                        <FormField
                          control={form.control}
                          name={`images.${index}.url`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-xs font-normal">Image URL</FormLabel>
                              <FormControl><Input {...field} placeholder="https://example.com/image.png" /></FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`images.${index}.hint`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-xs font-normal">Image AI Hint</FormLabel>
                              <FormControl><Input {...field} placeholder="e.g. hotel room" /></FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        onClick={() => remove(index)}
                        disabled={fields.length <= 1}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Remove Image</span>
                      </Button>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() => append({ url: "https://placehold.co/600x400.png", hint: "" })}
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Another Image
              </Button>
              <FormMessage>{form.formState.errors.images?.root?.message}</FormMessage>
            </div>

            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setIsOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="animate-spin mr-2" />}
                Save
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
