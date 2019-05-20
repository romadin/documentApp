export interface WorkFunctionApiResponseInterface {
    id: number;
    name: string;
    isMainFunction: boolean;
    order: number;
    templateId: number;
}

export interface WorkFunctionUpdateBody {
    name?: string;
    chapters?: number[];
    headlines?: number[];
    order?: number;
}
