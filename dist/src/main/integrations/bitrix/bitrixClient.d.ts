export declare class BitrixClient {
    private http;
    constructor(base?: string, token?: string);
    createLead(fields: any): Promise<any>;
    updateLead(id: number, fields: any): Promise<any>;
    createDeal(fields: any): Promise<any>;
}
