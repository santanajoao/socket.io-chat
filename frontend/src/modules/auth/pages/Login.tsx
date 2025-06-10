'use client'

import { Button } from "@/modules/shared/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/modules/shared/components/ui/form"
import { Input } from "@/modules/shared/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { loginSchema } from "../schemas/loginSchema";
import { LoginFields } from "../types/login";
import Link from "next/link";
import { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/modules/shared/components/ui/alert";
import { AlertCircle, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { ApiErrorResponse } from "@/modules/shared/types/backend";
import { PageContainer } from "@/modules/shared/components/containers/PageContainer";
import { ROUTES } from "@/modules/shared/constants/routes";
import { useAuthContext } from "../contexts/authContext";

export function LoginPage() {
  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const router = useRouter();
  const authContext = useAuthContext();

  const [apiError, setApiError] = useState<ApiErrorResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  async function onSubmit(data: LoginFields) {
    setIsLoading(true);

    const response = await authContext.login(data);
    if (response.error) {
      setApiError(response.error);
      setIsLoading(false);
    } else {
      router.push('/');
    }
  }

  return (
    <PageContainer>
      <main className="max-w-sm w-full">
        <div className="text-center">
          <span className="text-2xl font-bold">TeamCollab</span>
          <h1>Log in to continue</h1>
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

            <Button size="lg" className="w-full">
              {isLoading && <Loader2 className="animate-spin" />}
              Enter
            </Button>
          </form>

          <p className="text-sm text-center mt-3">
            <span>Don't have an account? </span>
            <Link href={ROUTES.SIGNUP} className="font-medium">Create one</Link>
          </p>
        </Form>
      </main>
    </PageContainer>
  );
}
