import { Button } from "@/modules/shared/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/modules/shared/components/ui/form";
import { Input } from "@/modules/shared/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useLoading } from "@/modules/shared/hooks/useLoading";
import { useChatContext } from "../contexts/ChatContext";
import { Loader2Icon } from "lucide-react";
import { ComponentProps, useState } from "react";
import { ApiErrorResponse } from "@/modules/shared/types/backend";
import { inviteToGroupChatSchema } from "../schemas/inviteToGroupChatSchema";
import { InviteToGroupChatFormFields } from "../types/inviteToGroupChat";
import { backendInviteApi } from "@/modules/invites/apis/backend";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/modules/shared/components/ui/dialog";

type Props = ComponentProps<typeof DialogTrigger>;

export function EmailInviteDialog({ children, className, ...props }: Props) {
  const form = useForm({
    resolver: zodResolver(inviteToGroupChatSchema),
    defaultValues: {
      email: "",
    },
  });

  const { setInvites, selectedChatId } = useChatContext();

  const [isLoading, handleLoading] = useLoading();
  const [error, setError] = useState<ApiErrorResponse | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  function onSubmit(data: InviteToGroupChatFormFields) {
    return handleLoading(async () => {
      if (!selectedChatId) return;

      const result = await backendInviteApi.inviteToGroupChat({
        email: data.email,
        chatId: selectedChatId,
      });
      if (result.error) {
        return setError(result.error);
      }

      setInvites((prev) => [result.data, ...prev]);
      setIsOpen(false);
    });
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger {...props}>
        {children}
      </DialogTrigger>

      <DialogContent className={className}>
        <DialogTitle>
          Invite new user
        </DialogTitle>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-2">
            <FormField
              control={form.control}
              name="email"
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
      </DialogContent>
    </Dialog>
  );
}
