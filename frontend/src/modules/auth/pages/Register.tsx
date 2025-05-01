'use client'

import { Button } from "@/modules/shared/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/modules/shared/components/ui/form"
import { Input } from "@/modules/shared/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { register } from "../api/backend";
import { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/modules/shared/components/ui/alert";
import { AlertCircle, Loader2 } from "lucide-react";
import { useLoading } from "@/modules/shared/hooks/useLoading";
import { useRouter } from "next/navigation";
import { ApiErrorResponse } from "@/modules/shared/types/backend";
import { registerSchema } from "../schemas/registerSchema";
import { RegisterFields } from "../types/register";
import { PageContainer } from "@/modules/shared/components/containers/PageContainer";
import { ROUTES } from "@/modules/shared/constants/routes";

export function RegisterPage() {
  const form = useForm<RegisterFields>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      password: '',
      passwordConfirmation: '',
      username: ''
    },
  });

  const router = useRouter();

  const [apiError, setApiError] = useState<ApiErrorResponse | null>(null);
  const [isLoading, handleLoading] = useLoading();

  async function onSubmit(data: RegisterFields) {
    return handleLoading(async () => {
      setApiError(null);

      const response = await register(data);
      if (response.error) {
        return setApiError(response.error);
      }

      router.push('/login');
    });
  }

  return (
    <PageContainer>
      <main className="max-w-sm w-full">
        <div className="text-center">
          <span className="text-2xl font-bold">TeamCollab</span>
          <h1>Create your account</h1>
        </div>

        {apiError && (
          <Alert variant="destructive" className="mt-8">
            <AlertCircle />
            <AlertTitle>{apiError.statusText}</AlertTitle>
            <AlertDescription>{apiError.message}</AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form className="mt-4 space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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

            <FormField
              control={form.control}
              name="passwordConfirmation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm your password</FormLabel>
                  <FormControl>
                    <Input {...field} type="password" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button size="lg" className="w-full">
              {isLoading && <Loader2 className="animate-spin" />}
              Create
            </Button>
          </form>

          <p className="text-sm text-center mt-3">
            <span>Already have an account? </span>
            <Link href={ROUTES.SIGNIN} className="font-medium">Login</Link>
          </p>
        </Form>
      </main>
    </PageContainer>
  );
}
