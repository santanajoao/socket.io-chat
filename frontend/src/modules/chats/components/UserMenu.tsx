import { Button } from "@/modules/shared/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/modules/shared/components/ui/popover";
import { ChatProfileBadge } from "./ChatProfileBadge";
import { LoaderContainer } from "@/modules/shared/components/containers/LoaderContainer";
import { useAuthContext } from "@/modules/auth/contexts/authContext";
import { LogOutIcon } from "lucide-react";

export function UserMenu() {
  const { user: loggedUser, logout, isLoading } = useAuthContext();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          aria-label="User actions menu"
          variant="ghost"
          size="blank"
          className="flex items-center gap-2"
        >
          {isLoading ? (
            <ChatProfileBadge className="bg-accent animate-pulse" />
          ) : (
            <ChatProfileBadge>
              {loggedUser?.username[0].toUpperCase()}
            </ChatProfileBadge>
          )}

          {isLoading ? (
            <LoaderContainer className="h-5 w-20" />
          ) : (
            <span className="font-medium">{loggedUser?.username}</span>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-min space-y-1" side="right">
        <ul>
          <li>
            <Button variant="outline" onClick={logout}>
              <LogOutIcon />

              Logout
            </Button>
          </li>
        </ul>
      </PopoverContent>
    </Popover>
  );
}
