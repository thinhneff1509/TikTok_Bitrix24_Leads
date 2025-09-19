import axios, { AxiosInstance } from 'axios';

export class BitrixClient {
    private http: AxiosInstance;
    constructor(
        base = process.env.BITRIX_BASE_URL || 'http://localhost:4000',
        token = process.env.BITRIX_TOKEN || 'dummy',
    ) {
        this.http = axios.create({
            baseURL: base,
            headers: { Authorization: `Bearer ${token}` },
            timeout: 8000,
        });
    }

    async createLead(fields: any)  { return (await this.http.post('/crm.lead.add', { fields })).data; }
    async updateLead(id: number, fields: any) { return (await this.http.post('/crm.lead.update', { id, fields })).data; }
    async createDeal(fields: any)  { return (await this.http.post('/crm.deal.add', { fields })).data; }
}
