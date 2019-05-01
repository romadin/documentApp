export interface ApiProjectResponse {
    id: number;
    name: string;
}

export interface ProjectUpdateData {
    name?: string;
}

export interface ProjectPostDataInterface {
    name: string;
    templateId: number;
    organisationId: number;
}
