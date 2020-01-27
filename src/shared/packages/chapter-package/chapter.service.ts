import { Injectable } from '@angular/core';
import { map, mergeMap, shareReplay, take, takeUntil } from 'rxjs/operators';
import { merge, Observable, of, Subject } from 'rxjs';

import { WorkFunction } from '../work-function-package/work-function.model';
import { ChapterApiResponseInterface, ChapterParam, ChapterPostBody, ChapterUpdateBody } from './interface/chapter-api-response.interface';
import { Chapter } from './chapter.model';
import { ApiService } from '../../service/api.service';
import { isChapter } from './interface/chapter.interface';
import { isWorkFunction } from '../work-function-package/interface/work-function.interface';

@Injectable()
export class ChapterService {
    private path = '/chapters';
    private chapterCache = {};

    private chaptersByWorkFunction$: Observable<Chapter[]>[] = [];
    private updateChapters$: Subject<void> = new Subject<void>();

    private subChaptersCache$: Observable<Chapter[]>[] = [];
    private updateSubChapters$: Subject<void> = new Subject<void>();

    private chapterEndStream$: Subject<void>[] = [];
    private subChapterEndStream$: Subject<void>[] = [];

    constructor( private apiService: ApiService) {  }

    getChaptersByWorkFunction(workFunction: WorkFunction): Observable<Chapter[]> {
        if (!this.chaptersByWorkFunction$[workFunction.id]) {
            const param = { workFunctionId: workFunction.id };
            this.chapterEndStream$[workFunction.id] = new Subject<void>();

            const initialChapters$ = this.getDataOnce(param, workFunction);
            const update$ = this.updateChapters$.pipe(mergeMap(() => this.getDataOnce(param, workFunction)));

            this.chaptersByWorkFunction$[workFunction.id] = merge(initialChapters$, update$).pipe(
                takeUntil(this.chapterEndStream$[workFunction.id]),
                shareReplay(1),
            );
        }
        return this.chaptersByWorkFunction$[workFunction.id];
    }


    getSubChapters(chapter: Chapter, workFunctionId: number): Observable<Chapter[]> {
        const param = { chapterId: chapter.id, workFunctionId: workFunctionId};
        if (!this.subChaptersCache$[chapter.id]) {
            this.subChapterEndStream$[chapter.id] = new Subject<void>();

            const initialChapters$ = this.getDataOnce(param, chapter);
            const update$ = this.updateSubChapters$.pipe(mergeMap(() => this.getDataOnce(param, chapter)));

            this.subChaptersCache$[chapter.id] = merge(initialChapters$, update$).pipe(
               takeUntil(this.subChapterEndStream$[chapter.id]),
               shareReplay(1)
           );
        }
        return this.subChaptersCache$[chapter.id];
    }

    getDataOnce(params: ChapterParam, parent: WorkFunction | Chapter): Observable<Chapter[]> {
        return this.requestChapters(params, parent);
    }

    requestChapters( params: ChapterParam, parent: WorkFunction | Chapter ): Observable<Chapter[]> {
        return this.apiService.get(this.path, params).pipe(
            map((result: ChapterApiResponseInterface[]) => result.map(response => this.makeChapter(response, parent)))
        );
    }

    createChapter(body: ChapterPostBody, params: ChapterParam, parent: Chapter| WorkFunction): Observable<Chapter> {
        return this.apiService.postInterface<ChapterApiResponseInterface>(this.path, body, params).pipe(
            map((result: ChapterApiResponseInterface) => {
                params.workFunctionId ? this.updateChapters$.next() : this.updateSubChapters$.next();
                return this.makeChapter(result, parent);
            })
        );
    }

    postChapters(body: {chapters: number[]}, params: ChapterParam, parent: WorkFunction): Observable<Chapter[]> {
        return this.apiService.postInterface<ChapterApiResponseInterface[]>(this.path, body, params).pipe(map(response => {
            this.updateChapters$.next();
            return response.map(r => this.makeChapter(r, parent));
        }));
    }

    updateChapter(chapter: Chapter, body: ChapterUpdateBody, params: ChapterParam, parent: Chapter| WorkFunction ): Observable<Chapter> {
        return this.apiService.postInterface<ChapterApiResponseInterface>(this.path + '/' + chapter.id, body, params).pipe(
            map((result: ChapterApiResponseInterface) => this.makeChapter(result, parent) )
        );
    }

    deleteChapter(chapter: Chapter, params: ChapterParam ): Observable<string> {
        return this.apiService.delete(this.path + '/' + chapter.id, params).pipe(
            map((result: string) => {
                if (params.chapterId) {
                    this.updateSubChapters$.next();
                } else {
                    // deleting chapter first level from work function.
                    this.updateChapters$.next();

                    // with this trigger we end the stream.
                    this.subChapterEndStream$[chapter.id].next();
                    // Remove the current cache.
                    this.subChaptersCache$[chapter.id] = null;
                }
                return result;
            })
        );
    }


    private makeChapter(data: ChapterApiResponseInterface, parent: WorkFunction | Chapter): Chapter {
        const chapter = new Chapter();
        chapter.id = data.id;
        chapter.name = data.name;
        chapter.content = data.content;
        chapter.order = data.order;
        chapter.parent = parent;
        chapter.chapters = isWorkFunction(parent) ?
            this.getSubChapters(chapter, parent.id).pipe(map((chapters) => chapters.sort((a, b) => a.order - b.order)))
            : of();
        this.chapterCache[chapter.id] = chapter;
        return chapter;
    }
}
