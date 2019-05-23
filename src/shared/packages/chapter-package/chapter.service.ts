import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { WorkFunction } from '../work-function-package/work-function.model';
import { ApiService } from '../../service/api.service';
import { CacheItem, CacheItemName, CacheService } from '../../service/cache.service';
import { Headline } from '../headline-package/headline.model';
import { Chapter } from './chapter.model';
import { ChapterApiResponseInterface, ChapterParam, ChapterPostBody, ChapterUpdateBody } from './interface/chapter-api-response.interface';
import { isWorkFunction } from '../work-function-package/interface/work-function.interface';

@Injectable()
export class ChapterService {
    private path = '/chapters';
    private cacheItemNameWorkFunction: CacheItemName = 'cacheChaptersWorkFunction';
    private cacheItemNameHeadline: CacheItemName = 'cacheChaptersHeadline';

    constructor(private cacheService: CacheService) {  }

    getChaptersByWorkFunction(workFunction: WorkFunction): Observable<Chapter[]> {
        const param = {workFunctionId: workFunction.id};
        return this.cacheService.get(this.cacheItemNameWorkFunction, this.path, param, workFunction.id).pipe(
            map((result: ChapterApiResponseInterface[]) => {
                const chapters = result.map(response => this.makeChapter(response));
                this.cacheService.cacheContainer[this.cacheItemNameWorkFunction][workFunction.id].items = chapters;
                return chapters;
            })
        );
    }
    getChaptersByHeadline(headline: Headline, workFunction: WorkFunction): Observable<Chapter[]> {
        const param = {headlineId: headline.id, workFunctionId: workFunction.id};

        return this.cacheService.get(this.cacheItemNameHeadline, this.path, param, headline.id).pipe(
            map((result: ChapterApiResponseInterface[]) => {
                const chapters = result.map(response => this.makeChapter(response));
                this.cacheService.cacheContainer[this.cacheItemNameHeadline][headline.id].items = chapters;
                return chapters;
            })
        );
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

    private getCacheItem(parent: Headline| WorkFunction): CacheItem {
        const cacheName: CacheItemName = isWorkFunction(parent) ? this.cacheItemNameWorkFunction : this.cacheItemNameHeadline;
        return this.cacheService.cacheContainer[cacheName][parent.id];
    }
}
