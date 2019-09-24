import { ApiUserResponse } from '../user-package/api-user.interface';
import { User } from '../user-package/user.model';

export interface ApiActionResponse {
    id: number;
    code: number;
    description: string;
    actionHolder?: ApiUserResponse;
    week: number;
    comments: string;
    isDone: boolean;
    projectId: number;
}

export interface ApiActionNewPostData {
    description: string;
    userId?: number;
    week?: number;
    comments?: string;
    projectId: number;
    isDone?: boolean;
}

export interface ApiActionEditPostData {
    description?: string;
    actionHolder?: string;
    week?: number;
    comments?: string;
    projectId?: number;
    isDone?: boolean;
}
export interface ActionUpdate {
    id: number;
    description: string;
    actionHolder: User;
}
