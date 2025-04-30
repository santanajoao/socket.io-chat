import { z } from "zod";
import { loginSchema } from "../schemas/loginSchema";

export type LoginFields = z.infer<typeof loginSchema>;

export type LoginResponse = {
  id: string;
  email: string;
  username: string;
};
