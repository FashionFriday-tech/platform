import { SyncCartSchema } from '@ff/schemas';
import { createZodDto } from 'nestjs-zod';

export class SyncCartDto extends createZodDto(SyncCartSchema) {}
