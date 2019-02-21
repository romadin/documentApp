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
}

export interface ApiRoleResponse {
    id: number;
    name: string;
}
