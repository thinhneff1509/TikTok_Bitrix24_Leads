"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BitrixSyncError = exports.InvalidSignatureError = exports.AppError = void 0;
const common_1 = require("@nestjs/common");
class AppError extends common_1.HttpException {
    constructor(message, status = common_1.HttpStatus.BAD_REQUEST, meta) {
        super({ message, ...meta }, status);
    }
}
exports.AppError = AppError;
class InvalidSignatureError extends AppError {
    constructor() { super('Invalid webhook signature', common_1.HttpStatus.UNAUTHORIZED, { code: 'INVALID_SIGNATURE' }); }
}
exports.InvalidSignatureError = InvalidSignatureError;
class BitrixSyncError extends AppError {
    constructor(reason) { super('Bitrix sync failed', common_1.HttpStatus.BAD_GATEWAY, { code: 'BITRIX_SYNC_FAILED', reason }); }
}
exports.BitrixSyncError = BitrixSyncError;
//# sourceMappingURL=appError.js.map