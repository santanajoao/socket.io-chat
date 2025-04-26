'use client'

import { Button } from "@/modules/shared/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/modules/shared/components/ui/form"
import { Input } from "@/modules/shared/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { loginSchema } from "../schemas/loginSchema";
import { LoginFields } from "../types/login";
import Link from "next/link";

export function LoginPage() {
  const form = useForm<LoginFields>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  function onSubmit(data: LoginFields) {
    console.log(data)
  }

  return (
    <div className="h-dvh w-full flex items-center justify-center">
      <main className="max-w-sm w-full">
        <div className="text-center">
          <span className="text-2xl font-bold">TeamCollab</span>
          <h1>Log in to continue</h1>
        </div>

        <Form {...form}>
          <form className="mt-8 space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} type="email" />
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
                    <Input {...field} type="password" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button size="lg" className="w-full">Enter</Button>
          </form>

          <p className="text-sm text-center mt-3">
            <span>Don't have an account? </span>
            <Link href="/register" className="font-medium">Create one</Link>
          </p>
        </Form>
      </main>
    </div>
  );
}
