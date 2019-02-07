export interface ApiDocResponse {
    id: number;
    originalName: string;
    name: string;
    content: string | null;
    foldersId: number[];
    order: number;
}

export interface DocPostData {
    name: string;
    content: string;
    foldersId?: number[];
}
