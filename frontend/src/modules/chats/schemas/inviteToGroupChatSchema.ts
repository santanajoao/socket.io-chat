import { z } from "zod";

export const inviteToGroupChatSchema = z.object({
  email: z.string().email(),
});
