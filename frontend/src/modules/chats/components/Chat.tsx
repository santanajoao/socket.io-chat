'use client';

import { cn } from "@/modules/shared/lib/utils";
import { ChatDetails } from "./ChatDetails";
import { ChatList } from "./ChatList";
import { ChatMessages } from "./ChatMessages";
import { useChatContext } from "../contexts/ChatContext";

export function Chat() {
  const { chatDetailsIsOpen } = useChatContext();

  return (
    <div className={cn("grid flex-1 w-full gap-0.5 overflow-hidden", {
      "grid-cols-[1fr_2fr] 2xl:grid-cols-[1fr_3fr]": !chatDetailsIsOpen,
      "grid-cols-[1fr_1fr] xl:grid-cols-[1fr_1fr_1fr] 2xl:grid-cols-[1fr_2fr_1fr]": chatDetailsIsOpen
    })}>
      <ChatList />
      <ChatMessages className={cn({ "hidden xl:flex": chatDetailsIsOpen })} />
      {chatDetailsIsOpen && <ChatDetails />}
    </div>
  );
}
