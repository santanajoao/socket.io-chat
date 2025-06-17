import { z } from 'zod';

export const passwordSchema = z.string().min(8);
export const usernameSchema = z.string().min(3);
