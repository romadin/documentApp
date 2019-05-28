import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApiService } from '../../service/api.service';
import { ChapterService } from '../chapter-package/chapter.service';
import { WorkFunction } from '../work-function-package/work-function.model';
import { HeadlineApiResponseInterface, HeadlinePostBody, HeadlineUpdateBody } from './interface/headline-api-response.interface';
import { Headline } from './headline.model';

@Injectable()
export class HeadlineService {
    private path = '/headlines';

    constructor(private apiService: ApiService, private chapterService: ChapterService) {  }

    getHeadlinesByWorkFunction(workFunction: WorkFunction): BehaviorSubject<Headline[]> {
        const param = {workFunctionId: workFunction.id};
        const headlines: BehaviorSubject<Headline[]> = new BehaviorSubject<Headline[]>([]);
        this.apiService.get(this.path, param).subscribe((result: HeadlineApiResponseInterface[]) => {
            headlines.next(result.map((response) => {
                const headline = this.makeHeadline(response);
                headline.chapters = this.chapterService.getChaptersByHeadline(headline, workFunction);
                return headline;
            }));
        });
        return headlines;
    }

    createHeadline(body: HeadlinePostBody, workFunction: WorkFunction): Observable<Headline> {
        const param = {workFunctionId: workFunction.id};
        return this.apiService.post(this.path, body, param).pipe(
            map((result: HeadlineApiResponseInterface) => this.makeHeadline(result))
        );
    }

    updateHeadline(body: HeadlineUpdateBody, headline: Headline, workFunction: WorkFunction): Observable<Headline> {
        const param = {workFunctionId: workFunction.id};
        return this.apiService.post(this.path + '/' + headline.id, body, param).pipe(
            map((result: HeadlineApiResponseInterface) => {
                const updatedHeadline = this.makeHeadline(result);
                const headlines = workFunction.headlines.getValue();
                const index = headlines.findIndex(h => h.id === headline.id);
                headlines[index] = updatedHeadline;
                workFunction.headlines.next(headlines);
                return updatedHeadline;
            })
        );
    }

    deleteHeadline(headline: Headline, workFunction: WorkFunction): Observable<string> {
        const param = {workFunctionId: workFunction.id};
        return this.apiService.delete(this.path + '/' + headline.id, param).pipe(
            map((result: string) => result )
        );
    }

    private makeHeadline(data: HeadlineApiResponseInterface): Headline {
        const headline = new Headline();
        headline.id = data.id;
        headline.name = data.name;
        headline.order = data.order;
        return headline;
    }
}
