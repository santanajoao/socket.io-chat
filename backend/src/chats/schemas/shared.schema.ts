import { z } from 'zod';

export const groupChatTitleSchema = z.string().min(1);
