import { CompanyApiResponseInterface } from '../company-package/interface/company-api-response.interface';

export interface ApiUserResponse {
    id: number;
    firstName: string;
    insertion: string | null;
    lastName: string;
    email: string;
    function: string;
    role: ApiRoleResponse;
    projectsId: number[];
    hasImage: boolean;
    phoneNumber: number;
    company: CompanyApiResponseInterface;
}

export interface UserBody {
    firstName: string;
    insertion: string | null;
    lastName: string;
    email: string;
    password: string;
    projectsId: string[];
    image: File;
}

export interface EditUserBody {
    firstName?: string;
    insertion?: string | null;
    lastName?: string;
    email?: string;
    projectsId?: string[];
    password?: string;
    company?: string;
}

export interface ApiRoleResponse {
    id: number;
    name: string;
}

export function isApiUserResponse(arg: any): arg is ApiUserResponse {
    return arg.id !== undefined &&
        arg.firstName !== undefined &&
        arg.insertion !== undefined &&
        arg.lastName !== undefined &&
        arg.email !== undefined &&
        arg.function !== undefined &&
        arg.role !== undefined &&
        arg.projectsId !== undefined &&
        arg.hasImage !== undefined &&
        arg.phoneNumber !== undefined &&
        arg.company !== undefined;
}
