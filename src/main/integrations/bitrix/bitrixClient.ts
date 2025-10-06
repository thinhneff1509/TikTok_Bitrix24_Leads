import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { Logger } from '@nestjs/common';

type BitrixOk<T> = { result: T };
type BitrixErr = { error: string; error_description?: string };
type BitrixResp<T> = BitrixOk<T> | BitrixErr;

export class BitrixClient {
  private http: AxiosInstance;
  private readonly log = new Logger(BitrixClient.name);

  constructor(baseUrl?: string) {
    const base = this.ensureTrailingSlash(
      baseUrl ?? process.env.BITRIX_BASE_URL ?? '',
    );
    if (!base) {
      throw new Error('BITRIX_BASE_URL is not set');
    }

    this.http = axios.create({
      baseURL: base,
      timeout: 10000,
    });

    // Logging debug when convert-to-deal
    this.http.interceptors.request.use((cfg) => {
      this.log.debug(` ${cfg.method?.toUpperCase()} ${cfg.baseURL}${cfg.url}`);
      if (cfg.data) this.log.debug(`Body: ${JSON.stringify(cfg.data)}`);
      return cfg;
    });
    this.http.interceptors.response.use(
      (res) => {
        this.log.debug(` ${res.status} ${res.config.url}`);
        return res;
      },
      (err) => {
        this.log.error(
          `${err.response?.status} ${err.config?.url} - ${JSON.stringify(err.response?.data)}`,
        );
        return Promise.reject(err);
      },
    );
  }

  async profile() {
    return this.call<any>('profile'); // test webhook
  }

  async createLead(fields: Record<string, any>): Promise<number> {
    return this.call<number>('crm.lead.add', {
      fields,
      params: { REGISTER_SONET_EVENT: 'N' },
    });
  }

  async updateLead(id: number, fields: Record<string, any>): Promise<boolean> {
    return this.call<boolean>('crm.lead.update', { id, fields });
  }

  async createDeal(fields: Record<string, any>): Promise<number> {
    return this.call<number>('crm.deal.add', {
      fields,
      params: { REGISTER_SONET_EVENT: 'N' },
    });
  }

  async createContact(fields: Record<string, any>): Promise<number> {
    return this.call<number>('crm.contact.add', {
      fields,
      params: { REGISTER_SONET_EVENT: 'N' },
    });
  }

  // Core call helper
  private async call<T>(
    method: string,
    body: any = {},
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const url = method.endsWith('.json') ? method : `${method}.json`;
    const res = await this.http.post<BitrixResp<T>>(url, body, {
      headers: { 'Content-Type': 'application/json' },
      ...(config ?? {}),
    });
    const data = res.data;

    if ((data as BitrixErr).error) {
      const err = data as BitrixErr;
      throw new Error(
        `Bitrix error: ${err.error} - ${err.error_description ?? ''}`,
      );
    }
    return (data as BitrixOk<T>).result;
  }

  private ensureTrailingSlash(s: string) {
    if (!s) return s;
    return s.endsWith('/') ? s : `${s}/`;
  }
}
