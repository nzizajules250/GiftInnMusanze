

"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { saveAmenityAction } from "@/lib/actions";
import { Loader2, Terminal } from "lucide-react";
import type { Amenity } from "@/lib/types";
import { availableIcons } from "@/lib/icons";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const formSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters."),
  description: z.string().min(10, "Description must be at least 10 characters."),
  details: z.string().min(5, "Details must be at least 5 characters."),
  icon: z.string().refine(val => availableIcons.includes(val), { message: "Invalid icon" }),
});

interface ManageAmenityDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  amenity: Amenity | null;
}

export function ManageAmenityDialog({ isOpen, setIsOpen, amenity }: ManageAmenityDialogProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { title: "", description: "", details: "", icon: "Wifi" },
  });

  useEffect(() => {
    if (amenity) {
      form.reset(amenity);
    } else {
      form.reset({ title: "", description: "", details: "", icon: "Wifi" });
    }
  }, [amenity, form, isOpen]);
  
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setError(null);
    const result = await saveAmenityAction({ ...values, id: amenity?.id });
    if (result.success) {
      toast({
        title: amenity ? "Amenity Updated" : "Amenity Added",
        description: `The amenity "${values.title}" has been saved.`,
      });
      setIsOpen(false);
    } else {
      setError(result.error || "An unexpected error occurred.");
    }
    setLoading(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-lg flex flex-col max-h-[90vh]">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>{amenity ? "Edit Amenity" : "Add New Amenity"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 flex flex-col overflow-y-hidden gap-4">
            <ScrollArea className="flex-1 pr-6">
                <div className="space-y-4">
                    <FormField control={form.control} name="title" render={({ field }) => (
                        <FormItem><FormLabel>Title</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                    <FormField control={form.control} name="description" render={({ field }) => (
                        <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                    <FormField control={form.control} name="details" render={({ field }) => (
                        <FormItem><FormLabel>Details</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                    <FormField control={form.control} name="icon" render={({ field }) => (
                        <FormItem><FormLabel>Icon</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                            <SelectTrigger><SelectValue placeholder="Select an icon" /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            {availableIcons.map(iconName => (
                            <SelectItem key={iconName} value={iconName}>{iconName}</SelectItem>
                            ))}
                        </SelectContent>
                        </Select>
                        <FormMessage />
                        </FormItem>
                    )}/>
                </div>
            </ScrollArea>
             {error && (
                <Alert variant="destructive">
                    <Terminal className="h-4 w-4" />
                    <AlertTitle>Save Failed</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}
            <DialogFooter className="pt-4 border-t flex-shrink-0">
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
