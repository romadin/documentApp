import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApiService } from '../../service/api.service';
import { ChapterService } from '../chapter-package/chapter.service';
import { WorkFunction } from '../work-function-package/work-function.model';
import { HeadlineApiResponseInterface } from './interface/headline-api-response.interface';
import { Headline } from './headline.model';

@Injectable()
export class HeadlineService {
    private path = '/headlines';

    constructor(private apiService: ApiService, private chapterService: ChapterService) {  }

    getHeadlinesByWorkFunction(workFunction: WorkFunction): Observable<Headline[]> {
        const param = {workFunctionId: workFunction.id};
        return this.apiService.get(this.path, param).pipe(
            map((result: HeadlineApiResponseInterface[]) => result.map((response) => {
                const headline = this.makeHeadline(response);
                this.chapterService.getChaptersByHeadline(headline, workFunction).subscribe(chapters => headline.chapters = chapters );
                return headline;
            }))
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
