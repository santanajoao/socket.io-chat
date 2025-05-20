import { z } from "zod";

export const newGroupChatSchema = z.object({
  name: z.string().min(1),
});

