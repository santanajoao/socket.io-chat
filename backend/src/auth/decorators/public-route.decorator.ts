import { SetMetadata } from '@nestjs/common';
import { IS_PUBLIC_KEY } from '../constants/decorators';

export const PublicRoute = () => SetMetadata(IS_PUBLIC_KEY, true);
