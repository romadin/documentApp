export interface ChapterApiResponseInterface {
    id: number;
    name: string;
    content: string;
    order: number;
    chapters: number[];
    parentChapterId?: number;
}

export interface ChapterParam {
    workFunctionId?: number;
    chapterId?: number;
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
