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
export interface CompanyApiUpdataData {
    name?: string;
    documentsId: number[];
    foldersId: number[];
}
