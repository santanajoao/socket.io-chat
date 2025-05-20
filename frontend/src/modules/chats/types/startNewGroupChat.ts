import { z } from "zod";
import { newGroupChatSchema } from "../schemas/newGroupChatSchema";
import { UserChat } from "@/modules/users/types/user-chats";

export type CreateGroupChatFormFields = z.infer<typeof newGroupChatSchema>;

export type CreateGroupChatApiBody = {
  name: string;
}

export type CreateGroupChatApiResponse = UserChat;
