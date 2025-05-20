import { z } from "zod";
import { newDirectChatSchema } from "../schemas/newDirectChatSchema";
import { UserInvite } from "@/modules/invites/types/user-invites";

export type InviteToDirectChatFormFields = z.infer<typeof newDirectChatSchema>;

export type InviteToDirectChatApiBody = {
  receiverEmail: string;
}

export type InviteToDirectChatApiResponse = UserInvite;