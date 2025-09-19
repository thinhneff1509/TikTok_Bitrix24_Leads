import { HttpException, HttpStatus } from '@nestjs/common';
export declare class AppError extends HttpException {
    constructor(message: string, status?: HttpStatus, meta?: any);
}
export declare class InvalidSignatureError extends AppError {
    constructor();
}
export declare class BitrixSyncError extends AppError {
    constructor(reason: any);
}
