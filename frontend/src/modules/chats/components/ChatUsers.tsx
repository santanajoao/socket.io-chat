import { Badge } from "@/modules/shared/components/ui/badge";
import { Button } from "@/modules/shared/components/ui/button";
import { Input } from "@/modules/shared/components/ui/input";
import { PlusIcon, SearchIcon } from "lucide-react";
import { EmailInviteDialog } from "./EmailInviteDialog";

export function ChatUsers() {
  return (
    <div className="flex flex-col gap-2">
      {/* abir modal igual ao de invite to direct chat */}
      <EmailInviteDialog className="sm:max-w-md" asChild>
        <Button size="dynamic" variant="outline" className="rounded-md w-full text-left justify-start">
          <Badge className="size-6 rounded-full">
            <PlusIcon />
          </Badge>

          <span>Invite new user</span>
        </Button>
      </EmailInviteDialog>

      {/* renderizar apenas se houver x ou mais usuários */}
      <div className="flex gap-2">
        <Input
          placeholder="Search for users"
          aria-controls="search-results"
          aria-label="Search for users"
        />

        <Button size="icon-default" aria-label="Execute search">
          <SearchIcon />
        </Button>
      </div>

      {/* fetch e loading de users */}
      <ul id="search-results" aria-live="polite">

      </ul>
    </div>
  );
}
