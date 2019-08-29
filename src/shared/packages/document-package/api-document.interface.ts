export interface ApiDocResponse {
    id: number;
    originalName: string;
    name: string;
    content: string | null;
    foldersId: number[];
    order: number;
    fromTemplate: boolean;
}

export interface DocPostData {
    name: string;
    content: string;
    folderId?: number;
}

export interface ParamDelete {
    workFunctionId?: number;
    documentId?: number;
    companyId?: number;
}
