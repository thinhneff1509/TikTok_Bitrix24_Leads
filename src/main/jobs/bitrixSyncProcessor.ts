import { Injectable, OnModuleInit } from '@nestjs/common';
import IORedis from 'ioredis';
import {
    Queue,
    Worker,
    QueueEvents,
    JobsOptions,
    QueueOptions,
} from 'bullmq';
import { BitrixClient } from '../integrations';

export enum BitrixJob {
    CREATE_OR_UPDATE_LEAD = 'b24:createOrUpdateLead',
    CONVERT_TO_DEAL       = 'b24:convertToDeal',
}

@Injectable()
export class BitrixSyncProcessor implements OnModuleInit {
    private readonly connection = new IORedis({
        host: process.env.REDIS_HOST || 'localhost',
        port: +(process.env.REDIS_PORT || 6379),
    });

    //QueueOptions
    private readonly queueOpts: QueueOptions = {
        connection: this.connection,
        defaultJobOptions: {
            attempts: 5,
            backoff: { type: 'exponential', delay: 1500 },
            removeOnComplete: 200,
            removeOnFail: 5000,
        } as JobsOptions,
    };

    public readonly queue = new Queue('bitrix-sync', this.queueOpts as QueueOptions);

    constructor(private readonly bitrix: BitrixClient) {}

    async onModuleInit() {
        const events = new QueueEvents('bitrix-sync', { connection: this.connection });
        await events.waitUntilReady();

        // Add rate limiter to Worker options
        new Worker(
            'bitrix-sync',
            async (job) => {
                switch (job.name) {
                    case BitrixJob.CREATE_OR_UPDATE_LEAD:
                        return this.bitrix.createLead(job.data.fields);
                    case BitrixJob.CONVERT_TO_DEAL:
                        return this.bitrix.createDeal(job.data.fields);
                }
            },
            {
                connection: this.connection,
                concurrency: 10,
                limiter: { max: 40, duration: 1000 }, // 40 job/second
            },
        );
    }

    async enqueueLeadSync(externalId: string, fields: any) {
        return this.queue.add(
            BitrixJob.CREATE_OR_UPDATE_LEAD,
            { externalId, fields },
            { jobId: `lead:${externalId}` },
        );
    }

    async enqueueDealConversion(leadId: string, fields: any) {
        return this.queue.add(
            BitrixJob.CONVERT_TO_DEAL,
            { leadId, fields },
            { jobId: `deal:${leadId}:${Date.now()}` },
        );
    }
}
