import { useAuthContext } from "@/modules/auth/contexts/authContext";
import { backendInviteApi } from "@/modules/invites/apis/backend";
import { UserInvite } from "@/modules/invites/types/user-invites";
import { Button } from "@/modules/shared/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/modules/shared/components/ui/popover";
import { useLoading } from "@/modules/shared/hooks/useLoading";
import { DateFormatter } from "@/modules/shared/utils/formatters/dates";
import { CheckIcon, XIcon } from "lucide-react";
import { ComponentProps, useEffect } from "react";
import { chatSocket } from "../socket/backend";
import { useChatContext } from "../contexts/ChatContext";
import { OnInviteResponseBody, RespondInviteParams } from "@/modules/invites/types/respond-invite";

type Props = ComponentProps<typeof PopoverTrigger>;

export function InvitesPopover({ children, ...props }: Props) {
  const authContext = useAuthContext();

  const { invites, setInvites } = useChatContext();
  const [inviteListIsLoading, handleInviteListIsLoading] = useLoading(true);

  const [inviteResponseIsLoading, handleInviteResponseIsLoading] = useLoading(false);


  async function fetchInvites() {
    return await handleInviteListIsLoading(async () => {
      const response = await backendInviteApi.getUserInvites();
      if (!response.error) {
        setInvites(response.data);
      }
    });
  }

  function createInviteMessage(invite: UserInvite) {
    const sentByYou = invite.senderUser.id === authContext.user?.id;
    const chatName = invite.chat.group ? invite.chat.group.title : 'direct chat'

    if (sentByYou) {
      return `You invited ${invite.receiverUser.username} to ${chatName}`;
    }
    return `${invite.senderUser.username} invited you to ${chatName}`;
  }

  function updateInviteOnResponse(updatedInvite: OnInviteResponseBody) {
    setInvites((prev) => prev.map((invite) => {
      if (invite.id === updatedInvite.inviteId) {
        return {
          ...invite,
          accepted: updatedInvite.accepted,
          acceptedAt: updatedInvite.acceptedAt,
        };
      }

      return invite;
    }));
  }

  async function respondInvite(data: RespondInviteParams) {
    return await handleInviteResponseIsLoading(async () => {
      const response = await backendInviteApi.respondInvite(data);

      if (response.error) return;

      updateInviteOnResponse(response.data);
    });
  }

  useEffect(() => {
    fetchInvites();

    function inviteListener(data: UserInvite) {
      setInvites((prev) => [data, ...prev]);
    }

    chatSocket.on('chat:invite', inviteListener);
    chatSocket.on('invite:response', updateInviteOnResponse)

    return () => {
      chatSocket.off('chat:invite', inviteListener);
      chatSocket.off('invite:response', updateInviteOnResponse)
    }
  }, []);

  return (
    <Popover>
      <PopoverTrigger {...props}>
        {children}
      </PopoverTrigger>

      <PopoverContent side="bottom" className="w-sm">
        <h3 className="mb-2 font-medium">Invites</h3>

        {inviteListIsLoading ? (
          'Loading...'
        ) : invites.length ? (
          invites.map((invite) => (
            <div
              className="px-2 py-1 border rounded-md flex items-center justify-between"
              key={invite.id}
            >
              <div className="flex flex-col">
                <span className="font-medium text-sm">
                  {createInviteMessage(invite)}
                </span>
                <span className="text-xs text-muted-foreground">
                  {DateFormatter.formatBrazilianDateTime(invite.createdAt)}
                </span>
              </div>

              {(invite.acceptedAt || invite.receiverUser.id === authContext.user?.id) && (
                <div className="flex gap-1">
                  {(!invite.acceptedAt || invite.accepted) && (
                    <Button
                      disabled={Boolean(invite.acceptedAt) || inviteResponseIsLoading}
                      onClick={() => respondInvite({ inviteId: invite.id, accept: true })}
                      variant="outline"
                      size="icon-sm"
                    >
                      <CheckIcon />
                    </Button>
                  )}

                  {(!invite.acceptedAt || invite.accepted === false) && (
                    <Button
                      disabled={Boolean(invite.acceptedAt) || inviteResponseIsLoading}
                      onClick={() => respondInvite({ inviteId: invite.id, accept: false })}
                      variant="destructive"
                      size="icon-sm"
                    >
                      <XIcon />
                    </Button>
                  )}
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="text-sm text-muted-foreground">No invites</p>
        )}
      </PopoverContent>
    </Popover >
  );
}
