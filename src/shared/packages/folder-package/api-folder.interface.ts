export interface ApiFolderResponse {
    id: number;
    name: string;
    projectId: number | null;
    on: boolean;
    subFolders: null | ApiFolderResponse[];
    isMain: boolean;
    order: number;
    fromTemplate: boolean;
    parentFoldersId: number[];
}

export interface FolderPostData {
    turnOn?: boolean;
    documents?: number[];
    name?: string;
}

export interface NewFolderPostData {
    name: string;
}
