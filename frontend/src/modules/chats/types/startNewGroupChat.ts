import { z } from "zod";
import { newGroupChatSchema } from "../schemas/newGroupChatSchema";
import { UserChat } from "@/modules/users/types/user-chats";

export type CreateGroupChatFormFields = z.infer<typeof newGroupChatSchema>;

export type CreateGroupChatApiBody = {
  title: string;
}

export type CreateGroupChatApiResponse = UserChat;
