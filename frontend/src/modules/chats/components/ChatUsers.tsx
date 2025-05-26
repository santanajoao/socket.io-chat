import { Badge } from "@/modules/shared/components/ui/badge";
import { Button } from "@/modules/shared/components/ui/button";
import { Input } from "@/modules/shared/components/ui/input";
import { PlusIcon, SearchIcon, XIcon } from "lucide-react";
import { EmailInviteDialog } from "./EmailInviteDialog";
import { useCallback, useEffect, useState } from "react";
import { ChatUser } from "../types/getChatUsers";
import { backendChatApi } from "../apis/backend";
import { useChatContext } from "../contexts/ChatContext";
import { ChatBadge } from "./ChatBadge";

export function ChatUsers() {
  const [chatUsers, setChatUsers] = useState<ChatUser[]>([]);

  const [search, setSearch] = useState<string>("");
  const [prevSearch, setPrevSearch] = useState<string>("");

  const { selectedChatId } = useChatContext();

  const fetchChatUsers = useCallback(async (params: { search?: string } = {}) => {
    if (!selectedChatId) return;

    const result = await backendChatApi.getChatUsers({
      chatId: selectedChatId,
      pageSize: 8,
      search: params.search ?? search,
    });

    if (result.error) return;

    setChatUsers(result.data.users);
  }, [selectedChatId, search]);

  function handleSearchInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSearch(e.target.value);
  }

  function handleSearch() {
    setPrevSearch(search);
    fetchChatUsers();
  }

  function clearSearch() {
    setSearch("");
    setPrevSearch("");

    fetchChatUsers({ search: "" });
  }

  useEffect(() => {
    fetchChatUsers();
  }, []);

  return (
    <div className="flex flex-col gap-2">
      {/* TODO: Lidar com dono do chat e permissões, apenas admins podem invitar */}
      <EmailInviteDialog className="sm:max-w-md" asChild>
        <Button size="dynamic" variant="outline" className="rounded-md w-full text-left justify-start">
          <Badge className="size-6 rounded-full">
            <PlusIcon />
          </Badge>

          <span>Invite new user</span>
        </Button>
      </EmailInviteDialog>

      {true && (
        <div className="flex gap-2">
          <Input
            placeholder="Search for users"
            aria-controls="search-results"
            aria-label="Search for users"
            value={search}
            onChange={handleSearchInputChange}
          />

          {prevSearch && (
            <Button
              onClick={clearSearch}
              size="icon-default"
              aria-label="Clear search"
            >
              <XIcon />
            </Button>
          )}

          <Button
            onClick={handleSearch}
            size="icon-default"
            aria-label="Execute search"
            disabled={!search || search === prevSearch}
          >
            <SearchIcon />
          </Button>
        </div>
      )}

      {/* TODO: Ações nos usuários, expulsar, etc */}
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
