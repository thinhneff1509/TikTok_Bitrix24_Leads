"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var TikTokService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TikTokService = void 0;
const common_1 = require("@nestjs/common");
const crypto = __importStar(require("crypto"));
const leadsService_1 = require("./leadsService");
const configService_1 = require("./configService");
const bitrixSyncProcessor_1 = require("../jobs/bitrixSyncProcessor");
const signatureUtils_1 = require("../common/utils/signatureUtils");
function getByPath(obj, path) {
    return path.split('.').reduce((o, k) => (o ? o[k] : undefined), obj);
}
function applyMapping(src, mapping) {
    const out = {};
    for (const [from, to] of Object.entries(mapping || {}))
        out[to] = getByPath(src, from);
    return out;
}
let TikTokService = TikTokService_1 = class TikTokService {
    leads;
    cfg;
    jobs;
    logger = new common_1.Logger(TikTokService_1.name);
    skipVerify = process.env.SKIP_SIGNATURE_VERIFY === '1' || process.env.NODE_ENV !== 'production';
    constructor(leads, cfg, jobs) {
        this.leads = leads;
        this.cfg = cfg;
        this.jobs = jobs;
    }
    async processWebhook(sig, payload, rawBody) {
        if (!this.skipVerify) {
            const secret = process.env.TIKTOK_WEBHOOK_SECRET || '';
            if (!secret)
                throw new common_1.UnauthorizedException('Missing webhook secret');
            if (!sig)
                throw new common_1.UnauthorizedException('Missing signature');
            const bodyBuff = rawBody ?? Buffer.from(typeof payload === 'string' ? payload : JSON.stringify(payload));
            const expected = crypto.createHmac('sha256', secret).update(bodyBuff).digest('base64');
            const ok = Buffer.byteLength(sig) === Buffer.byteLength(expected) &&
                crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected));
            if (!ok)
                throw new common_1.UnauthorizedException('Invalid signature');
        }
        else {
            this.logger.warn('Signature verification is SKIPPED (dev mode)');
        }
        const external_id = String(payload?.event_id || '');
        const name = (payload?.lead_data?.full_name ?? 'Unknown').toString().trim();
        const email = payload?.lead_data?.email?.toString().trim().toLowerCase() ?? undefined;
        const phone = (0, signatureUtils_1.normalizePhone)(payload?.lead_data?.phone ?? undefined) ?? undefined;
        const campaign_id = payload?.campaign?.campaign_id ?? undefined;
        const ad_id = payload?.campaign?.ad_id ?? undefined;
        const lead = await this.leads.upsertFromTikTok({
            external_id,
            source: 'tiktok',
            name,
            email,
            phone,
            campaign_id,
            ad_id,
            raw_data: payload,
        });
        const mapping = await this.cfg.getFieldMapping();
        const b24Fields = applyMapping(payload, mapping);
        await this.jobs.enqueueLeadSync(external_id, b24Fields);
        return { ok: true, lead };
    }
};
exports.TikTokService = TikTokService;
exports.TikTokService = TikTokService = TikTokService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [leadsService_1.LeadsService,
        configService_1.ConfigService,
        bitrixSyncProcessor_1.BitrixSyncProcessor])
], TikTokService);
//# sourceMappingURL=tiktokService.js.map