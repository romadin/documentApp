export interface ApiActionResponse {
    id: number;
    code: number;
    description: string;
    actionHolder: string;
    week: number;
    comments: string;
    isDone: boolean;
    projectId: number;
}

export interface ApiActionNewPostData {
    description: string;
    actionHolder: string;
    week: number;
    comments: string;
    projectId: number;
    isDone?: boolean;
}

export interface ApiActionEditPostData {
    description?: string;
    holder?: string;
    week?: number;
    comments?: string;
    projectId?: number;
    isDone?: boolean;
}
