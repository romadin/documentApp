export interface ApiUserResponse {
    id: number;
    firstName: string;
    insertion: string | null;
    lastName: string;
    email: string;
    function: string;
    role: ApiRoleResponse;
    projectsId: number[];
}

export interface UserBody {
    firstName: string;
    insertion: string | null;
    lastName: string;
    email: string;
    password: string;
    projectsId: string[];
}

export interface ApiRoleResponse {
    id: number;
    name: string;
}
