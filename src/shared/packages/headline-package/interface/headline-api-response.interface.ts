export interface HeadlineApiResponseInterface {
    id: number;
    name: string;
    order: number;
}

export interface HeadlinePostBody {
    name: string;
}

export interface HeadlineUpdateBody {
    name?: string;
    order?: string;
}
