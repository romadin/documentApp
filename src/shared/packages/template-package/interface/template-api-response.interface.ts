export interface TemplateApiResponseInterface {
    id: number;
    name: string;
    folders: TemplateItemInterface[];
    subFolders: TemplateItemInterface[];
    documents: TemplateItemInterface[];
    subDocuments: TemplateParentItemInterface[];
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
