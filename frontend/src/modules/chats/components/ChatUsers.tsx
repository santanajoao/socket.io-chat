import { Badge } from "@/modules/shared/components/ui/badge";
import { Button } from "@/modules/shared/components/ui/button";
import { Input } from "@/modules/shared/components/ui/input";
import { PlusIcon, SearchIcon } from "lucide-react";
import { EmailInviteDialog } from "./EmailInviteDialog";
import { useEffect, useState } from "react";
import { ChatUser } from "../types/getChatUsers";
import { backendChatApi } from "../apis/backend";
import { useChatContext } from "../contexts/ChatContext";
import { ChatBadge } from "./ChatBadge";

export function ChatUsers() {
  const [chatUsers, setChatUsers] = useState<ChatUser[]>([]);

  const { selectedChatId, selectedChat } = useChatContext();

  // TODO: implement pagination
  // TODO: on simple render, fetch chat only once, then update with socket
  // TODO: on scroll down fetch more
  // TODO: on search fetch and replace
  async function fetchChatUsers() {
    if (!selectedChatId) return;

    const result = await backendChatApi.getChatUsers({
      chatId: selectedChatId,
      pageSize: 10,
    });

    if (result.error) return;

    setChatUsers(result.data.users);
  }

  useEffect(() => {
    fetchChatUsers();
  }, [selectedChatId]);

  return (
    <div className="flex flex-col gap-2">
      <EmailInviteDialog className="sm:max-w-md" asChild>
        <Button size="dynamic" variant="outline" className="rounded-md w-full text-left justify-start">
          <Badge className="size-6 rounded-full">
            <PlusIcon />
          </Badge>

          <span>Invite new user</span>
        </Button>
      </EmailInviteDialog>

      {/* TODO: implement search */}
      {(selectedChat?.usersCount && selectedChat.usersCount > 10) && (
        <div className="flex gap-2">
          <Input
            placeholder="Search for users"
            aria-controls="search-results"
            aria-label="Search for users"
          />

          <Button size="icon-default" aria-label="Execute search">
            <SearchIcon />
          </Button>
        </div>
      )}

      <ul id="search-results" aria-live="polite" className="flex flex-col gap-1">
        {chatUsers.map((user) => (
          <li key={user.id}>
            <div className="flex items-center gap-2 border rounded-md p-2">
              <ChatBadge>
                {user.username[0].toUpperCase()}
              </ChatBadge>

              <span>{user.username}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
