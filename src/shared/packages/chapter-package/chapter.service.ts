import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { WorkFunction } from '../work-function-package/work-function.model';
import { ApiService } from '../../service/api.service';
import { ChapterApiResponseInterface, ChapterParam, ChapterPostBody, ChapterUpdateBody } from './interface/chapter-api-response.interface';
import { Chapter } from './chapter.model';
import { Headline } from '../headline-package/headline.model';

@Injectable()
export class ChapterService {
    private path = '/chapters';

    constructor(private apiService: ApiService) {  }

    getChaptersByWorkFunction(workFunction: WorkFunction): Observable<Chapter[]> {
        const param = {workFunctionId: workFunction.id};
        return this.apiService.get(this.path, param).pipe(
            map((result: ChapterApiResponseInterface[]) => result.map(response => this.makeChapter(response)))
        );
    }
    getChaptersByHeadline(headline: Headline, workFunction: WorkFunction): Observable<Chapter[]> {
        const param = {headlineId: headline.id, workFunctionId: workFunction.id};
        return this.apiService.get(this.path, param).pipe(
            map((result: ChapterApiResponseInterface[]) => result.map(response => this.makeChapter(response)))
        );
    }

    createChapter(body: ChapterPostBody, params?): Observable<Chapter> {
        return this.apiService.post(this.path, body, params).pipe(
            map((result: ChapterApiResponseInterface) => this.makeChapter(result) )
        );
    }

    updateChapter(chapter: Chapter, body: ChapterUpdateBody, params: ChapterParam, ): Observable<Chapter> {
        return this.apiService.post(this.path + '/' + chapter.id, body, params).pipe(
            map((result: ChapterApiResponseInterface) => this.makeChapter(result) )
        );
    }

    deleteChapter(chapter: Chapter, params: ChapterParam ): Observable<string> {
        return this.apiService.delete(this.path + '/' + chapter.id, params).pipe(
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
}
