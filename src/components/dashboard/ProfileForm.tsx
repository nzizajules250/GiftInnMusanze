
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { updateUserProfileAction } from "@/lib/actions";
import { Loader2, Terminal } from "lucide-react";
import type { SessionPayload, UserProfile } from "@/lib/types";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  avatar: z.string().url("Please enter a valid image URL.").or(z.literal("")).optional(),
  currentPassword: z.string().optional(),
  newPassword: z.string().optional(),
  confirmPassword: z.string().optional(),
}).refine(data => data.newPassword === data.confirmPassword, {
    message: "New passwords do not match.",
    path: ["confirmPassword"],
})
.refine(data => !data.newPassword || data.newPassword.length >= 8, {
    message: "New password must be at least 8 characters.",
    path: ["newPassword"],
})
.refine(data => !data.newPassword || !!data.currentPassword, {
    message: "Current password is required to set a new one.",
    path: ["currentPassword"],
});


interface ProfileFormProps {
    user: UserProfile;
    session: SessionPayload;
}

export function ProfileForm({ user, session }: ProfileFormProps) {
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const isGuest = session.role === 'guest';

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          name: user.name,
          avatar: user.avatar && !user.avatar.startsWith('https://placehold.co') ? user.avatar : '',
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setLoading(true);
        setError(null);
        const result = await updateUserProfileAction(values);
        if (result.success) {
            toast({
                title: "Profile Updated",
                description: "Your profile has been successfully updated.",
            });
            form.reset({
                ...form.getValues(),
                currentPassword: "",
                newPassword: "",
                confirmPassword: "",
            });
        } else {
            setError(result.error || "An unexpected error occurred.");
        }
        setLoading(false);
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Full Name</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                            <Input defaultValue={user.email} disabled />
                        </FormControl>
                    </FormItem>
                </div>
                
                <FormField
                    control={form.control}
                    name="avatar"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Avatar URL</FormLabel>
                            <FormControl>
                                <Input placeholder="https://example.com/your-image.png" {...field} />
                            </FormControl>
                            <FormDescription>Enter a URL to a new profile picture. Leave blank to use default.</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {!isGuest && (
                    <>
                        <div className="space-y-2">
                            <FormField
                                control={form.control}
                                name="currentPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Current Password</FormLabel>
                                        <FormControl>
                                            <Input type="password" placeholder="Enter current password to change" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                                control={form.control}
                                name="newPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>New Password</FormLabel>
                                        <FormControl>
                                            <Input type="password" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="confirmPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Confirm New Password</FormLabel>
                                        <FormControl>
                                            <Input type="password" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </>
                )}
                
                {error && (
                    <Alert variant="destructive">
                        <Terminal className="h-4 w-4" />
                        <AlertTitle>Update Failed</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}
                
                <div className="pt-6 border-t">
                    <Button type="submit" disabled={loading}>
                        {loading && <Loader2 className="animate-spin mr-2" />}
                        Update Profile
                    </Button>
                </div>
            </form>
        </Form>
    );
}
