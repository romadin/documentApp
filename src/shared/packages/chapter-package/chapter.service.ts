import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { BehaviorSubject, combineLatest, Observable, Subject } from 'rxjs';
import { ApiDocResponse } from '../document-package/api-document.interface';
import { Document } from '../document-package/document.model';

import { WorkFunction } from '../work-function-package/work-function.model';
import { isWorkFunction } from '../work-function-package/interface/work-function.interface';
import { ChapterApiResponseInterface, ChapterParam, ChapterPostBody, ChapterUpdateBody } from './interface/chapter-api-response.interface';
import { Chapter } from './chapter.model';
import { Headline } from '../headline-package/headline.model';
import { CacheGetParam, CacheItem, CacheItemBaseName, CacheService } from '../../service/cache.service';
interface ChapterCacheObservable {
    [id: number]: Subject<Chapter>;
}
@Injectable()
export class ChapterService {
    private path = '/chapters';
    private cacheItemNameWorkFunction: CacheItemBaseName = 'cacheChaptersWorkFunction';
    private cacheItemNameChapter: CacheItemBaseName = 'cacheChapter';
    private chapterByIdCache: ChapterCacheObservable = {};

    constructor(private cacheService: CacheService) {  }

    getChapter(id: number, param: ChapterParam): Subject<Chapter> {
        if (this.chapterByIdCache[id]) {
            return this.chapterByIdCache[id];
        }

        const chapter: Subject<Chapter> = new Subject<Chapter>();

        this.cacheService.get(`${this.cacheItemNameChapter}${id}`, `${this.path}/${id}`, param).subscribe(result => {
            chapter.next(this.makeChapter(result));
        });

        this.chapterByIdCache[id] = chapter;
        return this.chapterByIdCache[id];
    }

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

        this.cacheService.get(this.cacheItemNameChapter, this.path, param, headline.id).subscribe(
            (result: ChapterApiResponseInterface[]) => {
                let chapters = result.map(response => this.makeChapter(response));
                chapters = chapters.sort((a, b) => a.order - b.order);
                this.cacheService.cacheContainer[this.cacheItemNameChapter][headline.id].items = chapters;
                chaptersContainer.next(chapters);
            }
        );
        return chaptersContainer;
    }

    createChapter(body: ChapterPostBody, params: ChapterParam, parent: Chapter| WorkFunction): Observable<Chapter> {
        return this.cacheService.post(this.path, body, params, this.getCacheItem(parent)).pipe(
            map((result: ChapterApiResponseInterface) => this.makeChapter(result) )
        );
    }

    updateChapter(chapter: Chapter, body: ChapterUpdateBody, params: ChapterParam, parent: Chapter| WorkFunction ): Observable<Chapter> {
        return this.cacheService.post(this.path + '/' + chapter.id, body, params, this.getCacheItem(parent, chapter)).pipe(
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
        chapter.parentChapterId = data.parentChapterId;
        chapter.chapters = new BehaviorSubject<Chapter[]>([]);

        combineLatest(data.chapters.map(chapterId => this.getChapter(chapterId, {chapterId: chapter.id}))).subscribe((chapters) => {
            chapters = chapters.sort((a, b) => a.order - b.order);
            chapter.chapters.next(chapters);
        });

        return chapter;
    }

    private getCacheItem(parent: Chapter| WorkFunction, chapter?: Chapter): CacheItem | CacheGetParam {
        const cacheName: string = isWorkFunction(parent) ? this.cacheItemNameWorkFunction
            : `${this.cacheItemNameChapter}${chapter ? chapter.id : ''}`;

        if (this.cacheService.cacheContainer[cacheName] && this.cacheService.cacheContainer[cacheName][parent.id]) {
            return this.cacheService.cacheContainer[cacheName][parent.id];
        } else if (this.cacheService.cacheContainer[cacheName]) {
            return <CacheItem>this.cacheService.cacheContainer[cacheName];
        } else {
            return {
                name: cacheName,
                url: this.path,
                parent: parent,
            };
        }
    }
}
