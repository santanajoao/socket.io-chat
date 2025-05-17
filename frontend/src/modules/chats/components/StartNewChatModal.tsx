'use client';

import { Button } from "@/modules/shared/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/modules/shared/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel } from "@/modules/shared/components/ui/form";
import { Input } from "@/modules/shared/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/modules/shared/components/ui/tabs";
import { ComponentProps, useState } from "react";
import { useForm } from "react-hook-form";
import { StartNewGroupForm } from "./StartNewGroupForm";
import { StartNewDirectChatForm } from "./StartNewDirectChatForm";

type ModalProps = ComponentProps<typeof Dialog> & {
  trigger?: false;
}

type TriggerProps = ComponentProps<typeof DialogTrigger> & {
  trigger?: true;
}

type Props = TriggerProps | ModalProps;

export function StartNewChatModal({ trigger = false, children, ...props }: Props) {
  const dialogProps = trigger ? {} : props;

  const hasOpen = 'open' in dialogProps;
  const [isOpen, setIsOpen] = useState(hasOpen ? dialogProps.open : false);

  if (hasOpen && dialogProps.open !== undefined && dialogProps.open !== isOpen) {
    setIsOpen(dialogProps.open);
  }

  function closeModal() {
    setIsOpen(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen} {...dialogProps}>
      {trigger && (
        <DialogTrigger {...props}>
          {children}
        </DialogTrigger>
      )}

      <DialogContent className="sm:max-w-md gap-6 flex-col flex">
        <DialogHeader>
          <DialogTitle>
            Start a new conversation
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="private" className="gap-[inherit]">
          <TabsList className="w-full">
            <TabsTrigger value="private">Private</TabsTrigger>
            <TabsTrigger value="group">Group</TabsTrigger>
          </TabsList>

          <TabsContent value="private">
            <StartNewDirectChatForm onClose={closeModal} />
          </TabsContent>

          <TabsContent value="group">
            <StartNewGroupForm onClose={closeModal} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
