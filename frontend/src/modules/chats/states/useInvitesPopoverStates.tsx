import { useAuthContext } from "@/modules/auth/contexts/authContext";
import { useChatContext } from "../contexts/ChatContext";
import { useLoading } from "@/modules/shared/hooks/useLoading";
import { backendInviteApi } from "@/modules/invites/apis/backend";
import { OnInviteResponseBody } from "@/modules/invites/types/respond-invite";
import { UserInvite } from "@/modules/invites/types/user-invites";
import { chatSocket } from "../socket/connection";
import { useCallback, useEffect, useState } from "react";
import { BackendChatSocketEvents } from "../socket/events";
import { CHAT_EVENTS } from "../constants/socketEvents";

// TODO: paginar invites

export function useInvitesPopoverStates() {
  const authContext = useAuthContext();

  const { invites, setInvites, setSelectedChatUsers, setSelectedChatDetails, selectedChatId, setUnansweredInvitesCount } = useChatContext();
  const [inviteListIsLoading, handleInviteListIsLoading] = useLoading(true);

  const [inviteResponseIsLoading, setInviteResponseIsLoading] = useState<boolean>(false);

  const [nextInvitesCursor, setNextInvitesCursor] = useState<string | undefined>(undefined);

  async function fetchInvites() {
    return handleInviteListIsLoading(async () => {
      const response = await backendInviteApi.getUserInvites({
        pageSize: 10,
        cursor: nextInvitesCursor,
      });

      if (!response.error) {
        setInvites((prev) => {
          if (nextInvitesCursor) {
            return [...prev, ...response.data.invites];
          }

          return response.data.invites;
        });
        setUnansweredInvitesCount(response.data.totalUnanswered);
        setNextInvitesCursor(response.data.next);
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

    setUnansweredInvitesCount((prev) => {
      if (updatedInvite.receiverUser.id === authContext.user?.id) {
        return prev - 1;
      }

      return prev;
    });

    setInviteResponseIsLoading(false);
  }, [authContext.user?.id]);

  const updateGroupUsersIfAccepted = useCallback((data: OnInviteResponseBody) => {
    const targetChatIsSelected = data.chatId === selectedChatId;
    if (!data.accepted || !targetChatIsSelected) return;

    setSelectedChatDetails((prev) => {
      if (!prev) return prev;

      return {
        ...prev,
        usersCount: prev.usersCount + 1
      }
    })

    setSelectedChatUsers((prev) => {
      const newChatUser = {
        id: data.receiverUser.id,
        username: data.receiverUser.username,
        isAdmin: false,
      }

      return [...prev, newChatUser]
    });
  }, [selectedChatId]);

  const onNewInviteListener = useCallback((data: UserInvite) => {
    setInvites((prev) => [data, ...prev]);
    setUnansweredInvitesCount((prev) => {
      if (data.receiverUser.id === authContext.user?.id) {
        return prev + 1;
      }

      return prev;
    });
  }, [authContext.user?.id])

  async function respondInvite(inviteId: string, accept: boolean) {
    setInviteResponseIsLoading(true);
    BackendChatSocketEvents.respondInvite(inviteId, accept);
  }

  useEffect(() => {
    fetchInvites();
  }, [])

  useEffect(() => {
    chatSocket.on(CHAT_EVENTS.CHAT_INVITE, onNewInviteListener);
    chatSocket.on(CHAT_EVENTS.INVITE_RESPONSE, updateInviteOnResponse)
    chatSocket.on(CHAT_EVENTS.INVITE_RESPONSE, updateGroupUsersIfAccepted);

    return () => {
      chatSocket.off(CHAT_EVENTS.CHAT_INVITE, onNewInviteListener);
      chatSocket.off(CHAT_EVENTS.INVITE_RESPONSE, updateInviteOnResponse)
      chatSocket.off(CHAT_EVENTS.INVITE_RESPONSE, updateGroupUsersIfAccepted);
    }
  }, [updateInviteOnResponse, updateGroupUsersIfAccepted, onNewInviteListener]);

  return {
    loggedUser: authContext.user,
    inviteListIsLoading,
    invites,
    inviteResponseIsLoading,
    respondInvite,
    fetchInvites,
    nextInvitesCursor,
  }
}
