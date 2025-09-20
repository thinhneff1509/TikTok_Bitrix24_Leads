"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BitrixClient = void 0;
const axios_1 = __importDefault(require("axios"));
const common_1 = require("@nestjs/common");
class BitrixClient {
    http;
    log = new common_1.Logger(BitrixClient.name);
    constructor(baseUrl) {
        const base = this.ensureTrailingSlash(baseUrl ?? process.env.BITRIX_BASE_URL ?? '');
        if (!base) {
            throw new Error('BITRIX_BASE_URL is not set');
        }
        this.http = axios_1.default.create({
            baseURL: base,
            timeout: 10000,
        });
        this.http.interceptors.request.use((cfg) => {
            this.log.debug(` ${cfg.method?.toUpperCase()} ${cfg.baseURL}${cfg.url}`);
            if (cfg.data)
                this.log.debug(`Body: ${JSON.stringify(cfg.data)}`);
            return cfg;
        });
        this.http.interceptors.response.use((res) => {
            this.log.debug(` ${res.status} ${res.config.url}`);
            return res;
        }, (err) => {
            this.log.error(`${err.response?.status} ${err.config?.url} - ${JSON.stringify(err.response?.data)}`);
            return Promise.reject(err);
        });
    }
    async profile() {
        return this.call('profile');
    }
    async createLead(fields) {
        return this.call('crm.lead.add', { fields, params: { REGISTER_SONET_EVENT: 'N' } });
    }
    async updateLead(id, fields) {
        return this.call('crm.lead.update', { id, fields });
    }
    async createDeal(fields) {
        return this.call('crm.deal.add', { fields, params: { REGISTER_SONET_EVENT: 'N' } });
    }
    async createContact(fields) {
        return this.call('crm.contact.add', { fields, params: { REGISTER_SONET_EVENT: 'N' } });
    }
    async call(method, body = {}, config) {
        const url = method.endsWith('.json') ? method : `${method}.json`;
        const res = await this.http.post(url, body, {
            headers: { 'Content-Type': 'application/json' },
            ...(config ?? {}),
        });
        const data = res.data;
        if (data.error) {
            const err = data;
            throw new Error(`Bitrix error: ${err.error} - ${err.error_description ?? ''}`);
        }
        return data.result;
    }
    ensureTrailingSlash(s) {
        if (!s)
            return s;
        return s.endsWith('/') ? s : `${s}/`;
    }
}
exports.BitrixClient = BitrixClient;
//# sourceMappingURL=bitrixClient.js.map