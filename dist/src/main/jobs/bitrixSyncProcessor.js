"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BitrixSyncProcessor = exports.BitrixJob = void 0;
const common_1 = require("@nestjs/common");
const ioredis_1 = __importDefault(require("ioredis"));
const bullmq_1 = require("bullmq");
const integrations_1 = require("../integrations");
var BitrixJob;
(function (BitrixJob) {
    BitrixJob["CREATE_OR_UPDATE_LEAD"] = "b24:createOrUpdateLead";
    BitrixJob["CONVERT_TO_DEAL"] = "b24:convertToDeal";
})(BitrixJob || (exports.BitrixJob = BitrixJob = {}));
let BitrixSyncProcessor = class BitrixSyncProcessor {
    bitrix;
    connection = new ioredis_1.default({
        host: process.env.REDIS_HOST || 'localhost',
        port: +(process.env.REDIS_PORT || 6379),
    });
    queueOpts = {
        connection: this.connection,
        defaultJobOptions: {
            attempts: 5,
            backoff: { type: 'exponential', delay: 1500 },
            removeOnComplete: 200,
            removeOnFail: 5000,
        },
    };
    queue = new bullmq_1.Queue('bitrix-sync', this.queueOpts);
    constructor(bitrix) {
        this.bitrix = bitrix;
    }
    async onModuleInit() {
        const events = new bullmq_1.QueueEvents('bitrix-sync', { connection: this.connection });
        await events.waitUntilReady();
        new bullmq_1.Worker('bitrix-sync', async (job) => {
            switch (job.name) {
                case BitrixJob.CREATE_OR_UPDATE_LEAD:
                    return this.bitrix.createLead(job.data.fields);
                case BitrixJob.CONVERT_TO_DEAL:
                    return this.bitrix.createDeal(job.data.fields);
            }
        }, {
            connection: this.connection,
            concurrency: 10,
            limiter: { max: 40, duration: 1000 },
        });
    }
    async enqueueLeadSync(externalId, fields) {
        return this.queue.add(BitrixJob.CREATE_OR_UPDATE_LEAD, { externalId, fields }, { jobId: `lead:${externalId}` });
    }
    async enqueueDealConversion(leadId, fields) {
        return this.queue.add(BitrixJob.CONVERT_TO_DEAL, { leadId, fields }, { jobId: `deal:${leadId}:${Date.now()}` });
    }
};
exports.BitrixSyncProcessor = BitrixSyncProcessor;
exports.BitrixSyncProcessor = BitrixSyncProcessor = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [integrations_1.BitrixClient])
], BitrixSyncProcessor);
//# sourceMappingURL=bitrixSyncProcessor.js.map