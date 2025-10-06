import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import * as crypto from 'crypto';
import { LeadsService } from './leadsService';
import { ConfigService } from './configService';
import { BitrixSyncProcessor } from '../jobs/bitrixSyncProcessor';
import { normalizePhone } from '../common/utils/signatureUtils';

// helpers
function getByPath(obj: any, path: string) {
  return path.split('.').reduce((o, k) => (o ? o[k] : undefined), obj);
}
function applyMapping(src: any, mapping: Record<string, string>) {
  const out: any = {};
  for (const [from, to] of Object.entries(mapping || {}))
    out[to] = getByPath(src, from);
  return out;
}

@Injectable()
export class TikTokService {
  private readonly logger = new Logger(TikTokService.name);
  private readonly skipVerify =
    process.env.SKIP_SIGNATURE_VERIFY === '1' ||
    process.env.NODE_ENV !== 'production';

  constructor(
    private readonly leads: LeadsService,
    private readonly cfg: ConfigService,
    private readonly jobs: BitrixSyncProcessor,
  ) {}

  async processWebhook(
    sig: string | undefined,
    payload: any,
    rawBody?: Buffer,
  ): Promise<{ ok: true; lead: any }> {
    if (!this.skipVerify) {
      const secret = process.env.TIKTOK_WEBHOOK_SECRET || '';
      if (!secret) throw new UnauthorizedException('Missing webhook secret');
      if (!sig) throw new UnauthorizedException('Missing signature');

      const bodyBuff: Buffer =
        rawBody ??
        Buffer.from(
          typeof payload === 'string' ? payload : JSON.stringify(payload),
        );

      // Using bodyBuff
      const expected = crypto
        .createHmac('sha256', secret)
        .update(bodyBuff)
        .digest('base64');

      const ok =
        Buffer.byteLength(sig) === Buffer.byteLength(expected) &&
        crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected));
      if (!ok) throw new UnauthorizedException('Invalid signature');
    } else {
      this.logger.warn('Signature verification is SKIPPED (dev mode)');
    }

    //  payload handle
    const external_id = String(payload?.event_id || '');
    const name = (payload?.lead_data?.full_name ?? 'Unknown').toString().trim();
    const email =
      payload?.lead_data?.email?.toString().trim().toLowerCase() ?? undefined;
    const phone =
      normalizePhone(payload?.lead_data?.phone ?? undefined) ?? undefined;
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
}
