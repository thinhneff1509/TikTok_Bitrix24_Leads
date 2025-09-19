import { ExporterService } from '../service/exporterService';
export declare class ExporterController {
    private readonly svc;
    constructor(svc: ExporterService);
    export(dr?: string): Promise<string>;
}
