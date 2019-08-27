export interface CompanyApiResponseInterface {
    id: number;
    name: string;
}

export interface CompanyApiGet {
    projectsId?: number[];
    workFunctionId?: number;
}

export interface CompanyApiPostData {
    name: string;
}
export interface CompanyApiUpdateData {
    name?: string;
    documentsId?: number[];
    foldersId?: number[];
    workFunctionId?: number;
}
export interface CompanyDeleteParam {
    workFunctionId: number;
}
