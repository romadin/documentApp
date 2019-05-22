import { Headline } from '../headline.model';

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

export function isHeadline(arg: any): arg is Headline {
    return arg.id !== undefined &&
        arg.name !== undefined &&
        arg.chapters !== undefined &&
        arg.order !== undefined;
}
