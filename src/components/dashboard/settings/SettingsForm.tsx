
// src/components/dashboard/settings/SettingsForm.tsx
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { updateUserSettingsAction } from "@/lib/actions";
import { Loader2, Terminal } from "lucide-react";
import { CardFooter } from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

const settingsSchema = z.object({
  emailNotifications: z.boolean(),
  pushNotifications: z.boolean(),
});

type SettingsFormValues = z.infer<typeof settingsSchema>;

interface SettingsFormProps {
  userSettings: SettingsFormValues;
}

export function SettingsForm({ userSettings }: SettingsFormProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPushSupported, setIsPushSupported] = useState(false);

  useEffect(() => {
    if ('Notification' in window) {
      setIsPushSupported(true);
    }
  }, []);

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: userSettings,
  });

  const handlePushToggle = async (checked: boolean) => {
    form.setValue('pushNotifications', checked);

    if (checked && isPushSupported) {
        if (Notification.permission === 'granted') {
            // Permission already granted, we can proceed
        } else if (Notification.permission !== 'denied') {
            const permission = await Notification.requestPermission();
            if (permission !== 'granted') {
                form.setValue('pushNotifications', false);
                toast({
                    title: "Permission Required",
                    description: "You need to grant permission to receive push notifications.",
                    variant: "destructive"
                });
            }
        } else {
            // Permission was explicitly denied.
            form.setValue('pushNotifications', false);
            toast({
                title: "Permission Denied",
                description: "To enable notifications, please update your browser settings.",
                variant: "destructive"
            });
        }
    }
  };

  async function onSubmit(data: SettingsFormValues) {
    setLoading(true);
    setError(null);
    const result = await updateUserSettingsAction(data);

    if (result.success) {
      toast({
        title: "Settings Updated",
        description: "Your notification preferences have been saved.",
      });
    } else {
      setError(result.error || "An unexpected error occurred.");
    }
    setLoading(false);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="emailNotifications"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Email Notifications</FormLabel>
                <FormDescription>
                  Receive emails about bookings, offers, and news.
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="pushNotifications"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Push Notifications</FormLabel>
                <FormDescription>
                  Get real-time alerts on this device.
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={handlePushToggle}
                  disabled={!isPushSupported}
                />
              </FormControl>
            </FormItem>
          )}
        />
        {error && (
            <Alert variant="destructive">
                <Terminal className="h-4 w-4" />
                <AlertTitle>Update Failed</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        )}
        <CardFooter className="p-0">
          <Button type="submit" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Preferences
          </Button>
        </CardFooter>
      </form>
    </Form>
  );
}
