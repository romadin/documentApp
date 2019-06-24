import { CompanyApiResponseInterface } from '../../company-package/company-api-response.interface';

export interface WorkFunctionApiResponseInterface {
    id: number;
    name: string;
    isMainFunction: boolean;
    order: number;
    templateId: number;
    on: boolean;
    fromTemplate: boolean;
    companies?: CompanyApiResponseInterface[];
}

export interface WorkFunctionUpdateBody {
    name?: string;
    chapters?: number[];
    headlines?: number[];
    documents?: number[];
    folders?: number[];
    order?: number;
    on?: boolean;
    companies?: number[];
}

export interface WorkFunctionGetParam {
    templateId?: number;
    projectId?: number;
}
