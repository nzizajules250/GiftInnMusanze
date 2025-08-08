
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { adminRegisterAction } from "@/lib/actions";
import { Loader2, Terminal } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";

const formSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters."),
  secretCode: z.string().min(1, "Secret code is required."),
});

export function AdminRegisterForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      secretCode: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setError(null);
    const result = await adminRegisterAction(values);

    if (result?.error) {
        setError(result.error);
    }
    // On success, the action redirects, so no need to handle success here.
    
    setLoading(false);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Address</FormLabel>
              <FormControl>
                <Input placeholder="admin@example.com" type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input placeholder="••••••••" type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="secretCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Secret Code</FormLabel>
              <FormControl>
                <Input placeholder="Your secret admin code" type="password" {...field} />
              </FormControl>
              <FormDescription>
                A special code is required to create an admin account.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        {error && (
            <Alert variant="destructive">
                <Terminal className="h-4 w-4" />
                <AlertTitle>Registration Failed</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        )}
        <Button type="submit" className="w-full" disabled={loading}>
            {loading && <Loader2 className="animate-spin mr-2" />}
            Create Admin Account
        </Button>
      </form>
    </Form>
  );
}
