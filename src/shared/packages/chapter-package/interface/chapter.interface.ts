import { Chapter } from '../chapter.model';

export function isChapter (arg: any): arg is Chapter {
    return arg.id !== undefined &&
        arg.name !== undefined &&
        arg.content !== undefined &&
        arg.headlineId !== undefined &&
        arg.order !== undefined;
}
