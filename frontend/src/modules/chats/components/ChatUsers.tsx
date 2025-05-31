import { Badge } from "@/modules/shared/components/ui/badge";
import { Button } from "@/modules/shared/components/ui/button";
import { Input } from "@/modules/shared/components/ui/input";
import { PlusIcon, SearchIcon, XIcon } from "lucide-react";
import { EmailInviteDialog } from "./EmailInviteDialog";
import { useCallback, useEffect, useState } from "react";
import { backendChatApi } from "../apis/backend";
import { useChatContext } from "../contexts/ChatContext";
import { ChatUserItem } from "./ChatUserItem";
import { useLoading } from "@/modules/shared/hooks/useLoading";

const USERS_PAGE_SIZE = 8;

export function ChatUsers() {
  const [search, setSearch] = useState<string>("");
  const [prevSearch, setPrevSearch] = useState<string>("");

  const { selectedChatId, selectedChatDetails, selectedChatUsers, setSelectedChatUsers } = useChatContext();

  const [chatUsersAreLoading, handleChatUsersLoading] = useLoading();

  const hasManyUsers = selectedChatDetails?.usersCount && selectedChatDetails.usersCount > USERS_PAGE_SIZE;

  const fetchChatUsers = useCallback(async (params: { search?: string } = {}) => {
    return handleChatUsersLoading(async () => {
      if (!selectedChatId) return;

      const result = await backendChatApi.getChatUsers({
        chatId: selectedChatId,
        pageSize: USERS_PAGE_SIZE,
        search: params.search ?? search,
      });

      if (result.error) return;

      setSelectedChatUsers(result.data.users);
    })
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

  // dar acesso admin
  // admin remover usuários
  // admin mudar nome do grupo
  // o criador não pode ser afetado por essas ações
  // admin invitar

  return (
    <div className="flex flex-col gap-2">
      {(!chatUsersAreLoading && selectedChatDetails?.isAdmin) && (
        <EmailInviteDialog className="sm:max-w-md" asChild>
          <Button size="dynamic" variant="outline" className="rounded-md w-full text-left justify-start">
            <Badge className="size-6 rounded-full">
              <PlusIcon />
            </Badge>

            <span>Invite new user</span>
          </Button>
        </EmailInviteDialog>
      )}

      {(!chatUsersAreLoading && hasManyUsers) && (
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

      {chatUsersAreLoading ? (
        <div>Loading...</div>
      ) : (
        <ul id="search-results" aria-live="polite" className="flex flex-col gap-1">
          {selectedChatUsers.map((user) => (
            <li key={user.id}>
              <ChatUserItem chatUser={user} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
