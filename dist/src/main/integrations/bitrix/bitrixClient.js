"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BitrixClient = void 0;
const axios_1 = __importDefault(require("axios"));
class BitrixClient {
    http;
    constructor(base = process.env.BITRIX_BASE_URL || 'http://localhost:4000', token = process.env.BITRIX_TOKEN || 'dummy') {
        this.http = axios_1.default.create({
            baseURL: base,
            headers: { Authorization: `Bearer ${token}` },
            timeout: 8000,
        });
    }
    async createLead(fields) { return (await this.http.post('/crm.lead.add', { fields })).data; }
    async updateLead(id, fields) { return (await this.http.post('/crm.lead.update', { id, fields })).data; }
    async createDeal(fields) { return (await this.http.post('/crm.deal.add', { fields })).data; }
}
exports.BitrixClient = BitrixClient;
//# sourceMappingURL=bitrixClient.js.map