export interface TemplateApiResponseInterface {
    id: number;
    name: string;
    organisationId: number;
    isDefault: boolean;
    workFunctions: TemplateItemInterface[];
}

export interface TemplateItemInterface {
    name: string;
    content: string;
    order?: number;
}

export interface TemplateParentItemInterface {
    name: string;
    items: TemplateItemInterface[];
}

export interface TemplatePostData {
    name: string;
    organisationId: number;
}

export interface TemplatePatchBody {
    name?: string;
    documents?: string;
    subDocuments?: string;
}
