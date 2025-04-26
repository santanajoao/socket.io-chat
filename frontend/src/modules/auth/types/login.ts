import { z } from "zod";
import { loginSchema } from "../schemas/loginSchema";

export type LoginFields = z.infer<typeof loginSchema>;
