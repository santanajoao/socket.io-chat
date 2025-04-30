import { z } from "zod";
import { registerSchema } from "../schemas/registerSchema";

export type RegisterFields = z.infer<typeof registerSchema>;

export type RegisterResponse = {
  id: string;
  username: string;
  email: string;
};