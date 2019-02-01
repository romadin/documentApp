export interface ApiFolderResponse {
    id: number;
    name: string;
    projectId: number;
    on: boolean;
    parentFolderId: number;
    isMain: boolean;
}

export interface FolderPostData {
    turnOn: boolean;
}
