import { useAuthContext } from "@/modules/auth/contexts/authContext";
import { useChatContext } from "../contexts/ChatContext";
import { useLoading } from "@/modules/shared/hooks/useLoading";
import { backendInviteApi } from "@/modules/invites/apis/backend";
import { OnInviteResponseBody } from "@/modules/invites/types/respond-invite";
import { UserInvite } from "@/modules/invites/types/user-invites";
import { chatSocket } from "../socket/connection";
import { useCallback, useEffect, useState } from "react";
import { BackendChatSocketEvents } from "../socket/events";

export function useInvitesPopoverStates() {
  const authContext = useAuthContext();

  const { invites, setInvites, setChats } = useChatContext();
  const [inviteListIsLoading, handleInviteListIsLoading] = useLoading(true);

  const [inviteResponseIsLoading, setInviteResponseIsLoading] = useState<boolean>(false);

  async function fetchInvites() {
    return await handleInviteListIsLoading(async () => {
      const response = await backendInviteApi.getUserInvites();
      if (!response.error) {
        setInvites(response.data);
      }
    });
  }

  const updateInviteOnResponse = useCallback((updatedInvite: OnInviteResponseBody) => {
    setInvites((prev) => prev.map((invite) => {
      if (invite.id === updatedInvite.id) {
        return {
          ...invite,
          accepted: updatedInvite.accepted,
          acceptedAt: updatedInvite.acceptedAt,
        };
      }

      return invite;
    }));

    setInviteResponseIsLoading(false);
  }, []);

  const updateGroupUsersIfAccepted = useCallback(({ receiverUser, accepted, chatId }: OnInviteResponseBody) => {
    if (!accepted) return;

    setChats((prev) => {
      return prev.map((chat) => {
        if (chat.id === chatId) {
          if (chat.group?.groupType !== "PRIVATE") return chat;

          return {
            ...chat,
            users: [...chat.users!, receiverUser],
            usersCount: chat.usersCount! + 1
          };
        }

        return chat;
      })
    })
  }, []);

  async function respondInvite(inviteId: string, accept: boolean) {
    setInviteResponseIsLoading(true);
    BackendChatSocketEvents.respondInvite(inviteId, accept);
  }

  useEffect(() => {
    fetchInvites();

    function onNewInviteListener(data: UserInvite) {
      setInvites((prev) => [data, ...prev]);
    }

    chatSocket.on('chat:invite', onNewInviteListener);
    chatSocket.on('invite:response', updateInviteOnResponse)
    chatSocket.on('invite:response', updateGroupUsersIfAccepted);

    return () => {
      chatSocket.off('chat:invite', onNewInviteListener);
      chatSocket.off('invite:response', updateInviteOnResponse)
      chatSocket.off('invite:response', updateGroupUsersIfAccepted);
    }
  }, []);

  return {
    loggedUser: authContext.user,
    inviteListIsLoading,
    invites,
    inviteResponseIsLoading,
    respondInvite
  }
}
