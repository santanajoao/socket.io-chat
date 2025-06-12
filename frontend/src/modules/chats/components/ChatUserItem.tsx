import { useAuthContext } from "@/modules/auth/contexts/authContext";
import { ChatUser } from "../types/getChatUsers"
import { ChatProfileBadge } from "./ChatProfileBadge";
import { Button } from "@/modules/shared/components/ui/button";
import { ShieldBanIcon, ShieldCheckIcon, UserRoundXIcon } from "lucide-react";
import { useChatContext } from "../contexts/ChatContext";
import { useLoading } from "@/modules/shared/hooks/useLoading";
import { backendChatApi } from "../apis/backend";
import { toast } from "sonner";
import { ConfirmationModalTrigger } from "./ConfirmationModalTrigger";

type Props = {
  chatUser: ChatUser;
}

export function ChatUserItem({ chatUser }: Props) {
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

      const response = await backendChatApi.updateAdminRights(
        selectedChatDetails.id,
        chatUser.id,
        { isAdmin: !chatUser.isAdmin }
      );

      if (response.error) {
        return toast.error(response.error.message, { richColors: true });
      }

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
    });
  }

  async function removeUserFromChat() {
    if (!selectedChatId) return;

    const response = await backendChatApi.removeUserFromChat({
      chatId: selectedChatId,
      userId: chatUser.id,
    });

    if (response.error) {
      return toast.error(response.error.message, { richColors: true });
    }
  }

  return (
    <div className="flex items-center gap-2 border rounded-md p-2 justify-between">
      <div className="gap-[inherit] flex items-center">
        <ChatProfileBadge>
          {chatUser.username[0].toUpperCase()}
        </ChatProfileBadge>

        <span>{chatUser.username}</span>
      </div>

      <div>
        {canDoDangerActionsToUser(chatUser) && (
          <>
            <ConfirmationModalTrigger
              asChild
              onConfirm={toggleAdminRights}
            >
              {chatUser.isAdmin ? (
                <Button
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
                  variant="ghost"
                  size="icon-default"
                  className="text-gray-500"
                  aria-label={`Grant admin permissions to ${chatUser.username}`}
                  disabled={actionIsLoading}
                >
                  <ShieldCheckIcon />
                </Button>
              )}
            </ConfirmationModalTrigger>

            <ConfirmationModalTrigger
              asChild
              variant="destructive"
              onConfirm={removeUserFromChat}
            >
              <Button
                variant="ghost"
                size="icon-default"
                className="text-red-500"
                aria-label={`Remove user ${chatUser.username} from chat`}
                disabled={actionIsLoading}
              >
                <UserRoundXIcon />
              </Button>
            </ConfirmationModalTrigger>
          </>
        )}
      </div>
    </div>
  );
}
