export interface ChapterApiResponseInterface {
    id: number;
    name: string;
    content: string;
    order: number;
    headlineId?: number;
}

export interface ChapterParam {
    workFunctionId?: number;
}

export interface ChapterUpdateBody {
    name?: string;
    content?: string;
    order?: number;
}

export interface ChapterPostBody {
    name: string;
    content?: string;
    headlineId?: number;
    order?: number;
}
