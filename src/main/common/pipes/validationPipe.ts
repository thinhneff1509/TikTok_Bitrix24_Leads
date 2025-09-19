import { ValidationPipe as VP } from '@nestjs/common';

export const ValidationPipe = new VP({
    whitelist: true,
    transform: true,
    forbidNonWhitelisted: true,
});
