'use client';

import { Button } from "@/modules/shared/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/modules/shared/components/ui/form";
import { Input } from "@/modules/shared/components/ui/input";
import { useLoading } from "@/modules/shared/hooks/useLoading";
import { ApiErrorResponse } from "@/modules/shared/types/backend";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useChatContext } from "../contexts/ChatContext";
import { backendChatApi } from "../apis/backend";
import { Loader2Icon } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { newGroupChatSchema } from "../schemas/newGroupChatSchema";
import { CreateGroupChatFormFields } from "../types/startNewGroupChat";
import { chatSocket } from "../socket/connection";
import { BackendChatSocketEvents } from "../socket/events";

type Props = {
  onClose: () => void;
}

export function StartNewGroupForm({ onClose }: Props) {
  const form = useForm({
    resolver: zodResolver(newGroupChatSchema),
    defaultValues: {
      name: "",
    },
  });

  const { setChats } = useChatContext();

  const [isLoading, handleLoading] = useLoading();
  const [error, setError] = useState<ApiErrorResponse | null>(null);

  function onSubmit(data: CreateGroupChatFormFields) {
    return handleLoading(async () => {
      const result = await backendChatApi.createGroupChat(data);
      if (result.error) {
        return setError(result.error);
      }

      BackendChatSocketEvents.joinChat(result.data.id);

      setChats((prev) => [result.data, ...prev]);
      onClose();
    });
  }

  return (
    <Form {...form}>
      <form className="flex flex-col gap-2" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Group name</FormLabel>
              <Input type="text" placeholder="Counter strike guys" {...field} />
              <FormMessage />
            </FormItem>
          )}
        />

        {error && (
          <FormMessage>{error.message}</FormMessage>
        )}

        <Button disabled={isLoading} type="submit" size="lg">
          {isLoading && <Loader2Icon className="animate-spin" />}
          Create group
        </Button>
      </form>
    </Form>
  );
}
