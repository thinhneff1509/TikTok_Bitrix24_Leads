export declare class BitrixClient {
    private http;
    private readonly log;
    constructor(baseUrl?: string);
    profile(): Promise<any>;
    createLead(fields: Record<string, any>): Promise<number>;
    updateLead(id: number, fields: Record<string, any>): Promise<boolean>;
    createDeal(fields: Record<string, any>): Promise<number>;
    createContact(fields: Record<string, any>): Promise<number>;
    private call;
    private ensureTrailingSlash;
}
