import { z } from "zod";
import { newDirectChatSchema } from "../schemas/newDirectChatSchema";
import { UserChat } from "@/modules/users/types/user-chats";
import { UserInvite } from "@/modules/invites/types/user-invites";

export type CreateDirectChatFormFields = z.infer<typeof newDirectChatSchema>;

export type CreateDirectChatApiBody = {
  receiverEmail: string;
}

export type CreateDirectChatApiResponse = UserInvite;