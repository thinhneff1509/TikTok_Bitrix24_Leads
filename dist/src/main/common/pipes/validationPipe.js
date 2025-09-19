"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationPipe = void 0;
const common_1 = require("@nestjs/common");
exports.ValidationPipe = new common_1.ValidationPipe({
    whitelist: true,
    transform: true,
    forbidNonWhitelisted: true,
});
//# sourceMappingURL=validationPipe.js.map