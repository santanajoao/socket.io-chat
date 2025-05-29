'use client';

import { UserInvite } from "@/modules/invites/types/user-invites";
import { Button } from "@/modules/shared/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/modules/shared/components/ui/popover";
import { DateFormatter } from "@/modules/shared/utils/formatters/dates";
import { CheckIcon, XIcon } from "lucide-react";
import { ComponentProps } from "react";
import { useInvitesPopoverStates } from "../states/useInvitesPopoverStates";

type Props = ComponentProps<typeof PopoverTrigger>;

export function InvitesPopover({ children, ...props }: Props) {
  const {
    loggedUser,
    inviteListIsLoading,
    invites,
    inviteResponseIsLoading,
    respondInvite,
  } = useInvitesPopoverStates();

  function formatInviteMessage(invite: UserInvite) {
    const sentByYou = invite.senderUser.id === loggedUser?.id;
    const chatName = invite.chat.group ? invite.chat.group.title : 'direct chat'

    if (sentByYou) {
      return `You invited ${invite.receiverUser.username} to ${chatName}`;
    }
    return `${invite.senderUser.username} invited you to ${chatName}`;
  }

  return (
    <Popover>
      <PopoverTrigger {...props}>
        {children}
      </PopoverTrigger>

      <PopoverContent className="w-sm">
        <h3 className="mb-2 font-medium">Invites</h3>

        {inviteListIsLoading ? (
          'Loading...'
        ) : invites.length ? (
          <ul className="flex flex-col gap-1">
            {invites.map((invite) => (
              <li key={invite.id}>
                <div
                  className="px-2 py-1 border rounded-md flex items-center justify-between"
                >
                  <div className="flex flex-col">
                    <span className="font-medium text-sm">
                      {formatInviteMessage(invite)}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {DateFormatter.formatBrazilianDateTime(invite.createdAt)}
                    </span>
                  </div>

                  {(invite.acceptedAt || invite.receiverUser.id === loggedUser?.id) && (
                    <div className="flex gap-1">
                      {(!invite.acceptedAt || invite.accepted) && (
                        <Button
                          disabled={Boolean(invite.acceptedAt) || inviteResponseIsLoading}
                          onClick={() => respondInvite(invite.id, true)}
                          variant="outline"
                          size="icon-sm"
                        >
                          <CheckIcon />
                        </Button>
                      )}

                      {(!invite.acceptedAt || invite.accepted === false) && (
                        <Button
                          disabled={Boolean(invite.acceptedAt) || inviteResponseIsLoading}
                          onClick={() => respondInvite(invite.id, false)}
                          variant="destructive"
                          size="icon-sm"
                        >
                          <XIcon />
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">No invites</p>
        )}
      </PopoverContent>
    </Popover >
  );
}
