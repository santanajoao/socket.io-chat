import { z } from "zod";
import { inviteToGroupChatSchema } from "../schemas/inviteToGroupChatSchema";
import { UserInvite } from "@/modules/invites/types/user-invites";

export type InviteToGroupChatFormFields = z.infer<typeof inviteToGroupChatSchema>;

export type InviteToGroupChatApiBody = {
  email: string;
  chatId: string;
};

export type InviteToGroupChatApiResponse = UserInvite;
