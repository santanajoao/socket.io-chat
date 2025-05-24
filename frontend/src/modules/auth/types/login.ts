import { z } from "zod";
import { loginSchema } from "../schemas/loginSchema";

export type LoginFields = z.infer<typeof loginSchema>;

export type LoggedUser = {
  id: string;
  email: string;
  username: string;
}

export type LoginResponse = LoggedUser;
