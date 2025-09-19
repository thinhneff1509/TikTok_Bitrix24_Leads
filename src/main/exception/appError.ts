import { HttpException, HttpStatus } from '@nestjs/common';

export class AppError extends HttpException {
    constructor(message: string, status: HttpStatus = HttpStatus.BAD_REQUEST, meta?: any) {
        super({ message, ...meta }, status);
    }
}

export class InvalidSignatureError extends AppError {
    constructor() { super('Invalid webhook signature', HttpStatus.UNAUTHORIZED, { code: 'INVALID_SIGNATURE' }); }
}

export class BitrixSyncError extends AppError {
    constructor(reason: any) { super('Bitrix sync failed', HttpStatus.BAD_GATEWAY, { code: 'BITRIX_SYNC_FAILED', reason }); }
}
