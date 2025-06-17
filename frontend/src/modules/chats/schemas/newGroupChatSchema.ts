import { z } from "zod";

export const newGroupChatSchema = z.object({
  title: z.string().min(1),
});

