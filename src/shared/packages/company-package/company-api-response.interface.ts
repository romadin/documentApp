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
