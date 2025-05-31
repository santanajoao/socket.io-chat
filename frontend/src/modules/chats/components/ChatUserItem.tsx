import { useAuthContext } from "@/modules/auth/contexts/authContext";
import { ChatUser } from "../types/getChatUsers"
import { ChatBadge } from "./ChatBadge";
import { Button } from "@/modules/shared/components/ui/button";
import { ShieldBanIcon, ShieldCheckIcon, UserRoundXIcon } from "lucide-react";
import { useChatContext } from "../contexts/ChatContext";

type Props = {
  chatUser: ChatUser;
}

export function ChatUserItem({ chatUser }: Props) {
  {/* TODO: Ações nos usuários, expulsar, etc */ }

  const { user: loggedUser } = useAuthContext();
  const { selectedChatDetails } = useChatContext();

  function canDoDangerActionsToUser(user: ChatUser) {
    const isLoggedUser = user.id === loggedUser?.id;
    const isCreator = user.id === selectedChatDetails?.group?.createdByUser?.id;

    const loggedIsCreator = loggedUser?.id === selectedChatDetails?.group?.createdByUser?.id;
    if (loggedIsCreator) {
      return !isLoggedUser;
    }

    return selectedChatDetails?.isAdmin && !user.isAdmin && !isLoggedUser && !isCreator;
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
              <Button variant="ghost" size="icon-default" className="text-red-500" aria-label="Revoke admin permissions">
                <ShieldBanIcon />
              </Button>
            ) : (
              <Button variant="ghost" size="icon-default" className="text-gray-500" aria-label="Grant admin permissions">
                <ShieldCheckIcon />
              </Button>
            )}

            <Button variant="ghost" size="icon-default" className="text-red-500" aria-label="Remove user">
              <UserRoundXIcon />
            </Button>
          </>
        )}
      </div>
    </div>
  );
}