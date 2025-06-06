import { useAuthContext } from "@/modules/auth/contexts/authContext";
import { ChatUser } from "../types/getChatUsers"
import { ChatBadge } from "./ChatBadge";
import { Button } from "@/modules/shared/components/ui/button";
import { ShieldBanIcon, ShieldCheckIcon, UserRoundXIcon } from "lucide-react";
import { useChatContext } from "../contexts/ChatContext";
import { useLoading } from "@/modules/shared/hooks/useLoading";
import { backendChatApi } from "../apis/backend";

type Props = {
  chatUser: ChatUser;
}

export function ChatUserItem({ chatUser }: Props) {
  {/* TODO: Ações nos usuários, expulsar, etc */ }

  const { user: loggedUser } = useAuthContext();
  const { selectedChatDetails, setSelectedChatUsers, selectedChatId } = useChatContext();
  const [actionIsLoading, handleActionLoading] = useLoading();

  function canDoDangerActionsToUser(user: ChatUser) {
    const isLoggedUser = user.id === loggedUser?.id;
    const isCreator = user.id === selectedChatDetails?.group?.createdByUser?.id;

    const loggedIsCreator = loggedUser?.id === selectedChatDetails?.group?.createdByUser?.id;
    if (loggedIsCreator) {
      return !isLoggedUser;
    }

    return selectedChatDetails?.isAdmin && !user.isAdmin && !isLoggedUser && !isCreator;
  }

  function toggleAdminRights() {
    return handleActionLoading(async () => {
      if (!selectedChatDetails || actionIsLoading) return;

      // TODO: add error toast
      const response = await backendChatApi.updateAdminRights(
        selectedChatDetails.id,
        chatUser.id,
        { isAdmin: !chatUser.isAdmin }
      );

      if (!response.error) {
        setSelectedChatUsers((prev) => {
          return prev.map((user) => {
            if (user.id === chatUser.id) {
              return {
                ...user,
                isAdmin: response.data.isAdmin,
              };
            }

            return user;
          });
        })
      };
    });
  }

  async function removeUserFromChat() {
    if (!selectedChatId) return;

    const response = await backendChatApi.removeUserFromChat({
      chatId: selectedChatId,
      userId: chatUser.id,
    });

    if (response.error) {
      // toggle
    }
  }

  return (
    <div className="flex items-center gap-2 border rounded-md p-2 justify-between">
      <div className="gap-[inherit] flex items-center">
        <ChatBadge>
          {chatUser.username[0].toUpperCase()}
        </ChatBadge>

        <span>{chatUser.username}</span>
      </div>

      <div>
        {canDoDangerActionsToUser(chatUser) && (
          <>
            {chatUser.isAdmin ? (
              <Button
                onClick={toggleAdminRights}
                variant="ghost"
                size="icon-default"
                className="text-red-500"
                aria-label={`Revoke admin permissions from ${chatUser.username}`}
                disabled={actionIsLoading}
              >
                <ShieldBanIcon />
              </Button>
            ) : (
              <Button
                onClick={toggleAdminRights}
                variant="ghost"
                size="icon-default"
                className="text-gray-500"
                aria-label={`Grant admin permissions to ${chatUser.username}`}
                disabled={actionIsLoading}
              >
                <ShieldCheckIcon />
              </Button>
            )}

            <Button
              variant="ghost"
              size="icon-default"
              className="text-red-500"
              aria-label={`Remove user ${chatUser.username} from chat`}
              disabled={actionIsLoading}
              onClick={removeUserFromChat}
            >
              <UserRoundXIcon />
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
