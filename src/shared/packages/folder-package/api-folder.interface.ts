export interface ApiFolderResponse {
    id: number;
    name: string;
    projectId: number;
    on: string;
    parentFolderId: number;
}

export interface FolderPostData {
    turnOn: boolean;
}
