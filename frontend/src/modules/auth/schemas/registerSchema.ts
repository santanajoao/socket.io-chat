import { z } from "zod";
import { emailSchema, passwordSchema } from "./shared";

export const registerSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  passwordConfirmation: passwordSchema,
  username: z.string().min(3),
}).superRefine((data, ctx) => {
  if (data.password !== data.passwordConfirmation) {
    ctx.addIssue({
      code: "custom",
      message: "Passwords don't match",
      path: ["passwordConfirmation"],
    });
  }
});
