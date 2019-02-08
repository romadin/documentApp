export interface ApiActionResponse {
    id: number;
    code: string;
    description: string;
    actionHolder: string;
    week: number;
    comments: string;
    isDone: string;
    projectId: number;
}

export interface ApiActionNewPostData {
    code: string;
    general: string;
    description: string;
    holder: string;
    week: number;
    comments: string;
    projectId: number;
    isDone?: boolean;
}

export interface ActionEditPostData {
    code?: string;
    description?: string;
    holder?: string;
    week?: number;
    comments?: string;
    projectId?: number;
    isDone?: boolean;
}
