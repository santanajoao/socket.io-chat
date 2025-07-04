'use client';

import { UserInvite } from "@/modules/invites/types/user-invites";
import { Button } from "@/modules/shared/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/modules/shared/components/ui/popover";
import { DateFormatter } from "@/modules/shared/utils/formatters/dates";
import { CheckIcon, XIcon } from "lucide-react";
import { ComponentProps } from "react";
import { useInvitesPopoverStates } from "../states/useInvitesPopoverStates";
import { LoaderContainer } from "@/modules/shared/components/containers/LoaderContainer";

type Props = ComponentProps<typeof PopoverTrigger>;

export function InvitesPopover({ children, ...props }: Props) {
  const {
    loggedUser,
    inviteListIsLoading,
    invites,
    inviteResponseIsLoading,
    respondInvite,
    fetchInvites,
    nextInvitesCursor,
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

      <PopoverContent className="w-sm max-h-[70dvh] flex flex-col">
        <h3 className="mb-2 font-medium">Invites</h3>

        <div className="flex flex-1 flex-col gap-1 overflow-y-auto">
          {invites.length ? (
            <>
              <ul className="flex flex-col gap-[inherit] ">
                {invites.map((invite) => (
                  <li key={invite.id} className="gap-[inherit]">
                    <div
                      className="px-2 py-1 border rounded-md flex items-center justify-between gap-[inherit]"
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
                        <div className="flex gap-[inherit]">
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

              {inviteListIsLoading && (
                <div className="flex-1 shrink-0 flex flex-col gap-[inherit] overflow-y-auto">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <LoaderContainer key={index} className="h-12" />
                  ))}
                </div>
              )}

              {nextInvitesCursor && (
                <Button size="sm" variant="default" disabled={inviteListIsLoading} onClick={fetchInvites}>
                  More
                </Button>
              )}
            </>
          ) : (
            <p className="text-sm text-muted-foreground">No invites</p>
          )}
        </div>
      </PopoverContent>
    </Popover >
  );
}
