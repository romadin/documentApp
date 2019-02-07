export interface ApiFolderResponse {
    id: number;
    name: string;
    projectId: number | null;
    on: boolean;
    subFolders: null | ApiFolderResponse[];
    isMain: boolean;
    order: number;
}

export interface FolderPostData {
    turnOn: boolean;
}
