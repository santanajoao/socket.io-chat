import { z } from "zod";

export const newDirectChatSchema = z.object({
  receiverEmail: z.string().email(),
});
