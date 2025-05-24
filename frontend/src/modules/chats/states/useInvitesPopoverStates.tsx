import { useAuthContext } from "@/modules/auth/contexts/authContext";
import { useChatContext } from "../contexts/ChatContext";
import { useLoading } from "@/modules/shared/hooks/useLoading";
import { backendInviteApi } from "@/modules/invites/apis/backend";
import { OnInviteResponseBody, RespondInviteParams } from "@/modules/invites/types/respond-invite";
import { UserInvite } from "@/modules/invites/types/user-invites";
import { chatSocket } from "../socket/backend";
import { useCallback, useEffect, useState } from "react";

export function useInvitesPopoverStates() {
  const authContext = useAuthContext();

  const { invites, setInvites } = useChatContext();
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

  async function respondInvite(data: RespondInviteParams) {
    setInviteResponseIsLoading(true);
    chatSocket.emit('invite:response', data);
  }

  useEffect(() => {
    fetchInvites();

    function onNewInviteListener(data: UserInvite) {
      setInvites((prev) => [data, ...prev]);
    }

    chatSocket.on('chat:invite', onNewInviteListener);
    chatSocket.on('invite:response', updateInviteOnResponse)

    return () => {
      chatSocket.off('chat:invite', onNewInviteListener);
      chatSocket.off('invite:response', updateInviteOnResponse)
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
