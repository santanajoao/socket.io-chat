import { Button } from "@/modules/shared/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/modules/shared/components/ui/form";
import { Input } from "@/modules/shared/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { newDirectChatSchema } from "../schemas/newDirectChatSchema";
import { InviteToDirectChatFormFields } from "../types/startNewDirectChat";
import { useLoading } from "@/modules/shared/hooks/useLoading";
import { useBackendChatApi } from "../apis/backend";
import { useChatContext } from "../contexts/ChatContext";
import { Loader2Icon } from "lucide-react";
import { useState } from "react";
import { ApiErrorResponse } from "@/modules/shared/types/backend";

type Props = {
  onClose: () => void;
}

export function StartNewDirectChatForm({ onClose }: Props) {
  const form = useForm({
    resolver: zodResolver(newDirectChatSchema),
    defaultValues: {
      receiverEmail: "",
    },
  });

  const { setInvites } = useChatContext();

  const [isLoading, handleLoading] = useLoading();
  const [error, setError] = useState<ApiErrorResponse | null>(null);

  const backendChatApi = useBackendChatApi();

  function onSubmit(data: InviteToDirectChatFormFields) {
    return handleLoading(async () => {
      const result = await backendChatApi.inviteToDirectChat(data);
      if (result.error) {
        return setError(result.error);
      }

      setInvites((prev) => [result.data, ...prev]);
      onClose();
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-2">
        <FormField
          control={form.control}
          name="receiverEmail"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <Input type="email" placeholder="Recipient's email" {...field} />
              <FormMessage />
            </FormItem>
          )}
        />

        {error && (
          <FormMessage>{error.message}</FormMessage>
        )}

        <Button disabled={isLoading} type="submit" size="lg">
          {isLoading && <Loader2Icon className="animate-spin" />}

          Send invite
        </Button>
      </form>
    </Form>
  );
}
