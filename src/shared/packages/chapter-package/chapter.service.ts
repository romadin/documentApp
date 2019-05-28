import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';

import { WorkFunction } from '../work-function-package/work-function.model';
import { isWorkFunction } from '../work-function-package/interface/work-function.interface';
import { ChapterApiResponseInterface, ChapterParam, ChapterPostBody, ChapterUpdateBody } from './interface/chapter-api-response.interface';
import { Chapter } from './chapter.model';
import { Headline } from '../headline-package/headline.model';
import { CacheGetParam, CacheItem, CacheItemName, CacheService } from '../../service/cache.service';

@Injectable()
export class ChapterService {
    private path = '/chapters';
    private cacheItemNameWorkFunction: CacheItemName = 'cacheChaptersWorkFunction';
    private cacheItemNameHeadline: CacheItemName = 'cacheChaptersHeadline';

    constructor(private cacheService: CacheService) {  }

    getChaptersByWorkFunction(workFunction: WorkFunction): BehaviorSubject<Chapter[]> {
        const param = {workFunctionId: workFunction.id};
        const chaptersContainer: BehaviorSubject<Chapter[]> = new BehaviorSubject<Chapter[]>([]);
        this.cacheService.get(this.cacheItemNameWorkFunction, this.path, param, workFunction.id).subscribe(
            (result: ChapterApiResponseInterface[]) => {
                const chapters = result.map(response => this.makeChapter(response));
                this.cacheService.cacheContainer[this.cacheItemNameWorkFunction][workFunction.id].items = chapters;
                chaptersContainer.next(chapters);
            }
        );
        return chaptersContainer;
    }
    getChaptersByHeadline(headline: Headline, workFunction: WorkFunction): BehaviorSubject<Chapter[]> {
        const param = {headlineId: headline.id, workFunctionId: workFunction.id};
        const chaptersContainer: BehaviorSubject<Chapter[]> = new BehaviorSubject<Chapter[]>([]);

        this.cacheService.get(this.cacheItemNameHeadline, this.path, param, headline.id).subscribe(
            (result: ChapterApiResponseInterface[]) => {
                let chapters = result.map(response => this.makeChapter(response));
                chapters = chapters.sort((a, b) => a.order - b.order);
                this.cacheService.cacheContainer[this.cacheItemNameHeadline][headline.id].items = chapters;
                chaptersContainer.next(chapters);
            }
        );
        return chaptersContainer;
    }

    createChapter(body: ChapterPostBody, params: ChapterParam, parent: Headline| WorkFunction): Observable<Chapter> {
        return this.cacheService.post(this.path, body, params, this.getCacheItem(parent)).pipe(
            map((result: ChapterApiResponseInterface) => this.makeChapter(result) )
        );
    }

    updateChapter(chapter: Chapter, body: ChapterUpdateBody, params: ChapterParam, parent: Headline| WorkFunction ): Observable<Chapter> {
        return this.cacheService.post(this.path + '/' + chapter.id, body, params, this.getCacheItem(parent)).pipe(
            map((result: ChapterApiResponseInterface) => this.makeChapter(result) )
        );
    }

    deleteChapter(chapter: Chapter, params: ChapterParam ): Observable<string> {
        return this.cacheService.delete(this.path + '/' + chapter.id, params).pipe(
            map((result: string) => result )
        );
    }

    private makeChapter(data: ChapterApiResponseInterface): Chapter {
        const chapter = new Chapter();
        chapter.id = data.id;
        chapter.name = data.name;
        chapter.content = data.content;
        chapter.order = data.order;
        chapter.headlineId = data.headlineId;

        return chapter;
    }

    private getCacheItem(parent: Headline| WorkFunction): CacheItem | CacheGetParam {
        const cacheName: CacheItemName = isWorkFunction(parent) ? this.cacheItemNameWorkFunction : this.cacheItemNameHeadline;
        if (!this.cacheService.cacheContainer[cacheName][parent.id]) {
            return {
                name: cacheName,
                url: this.path,
                parent: parent,
            };
        }

        return this.cacheService.cacheContainer[cacheName][parent.id];
    }
}
