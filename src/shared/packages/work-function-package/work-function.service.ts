import { Injectable } from '@angular/core';
import { WorkFunction } from './work-function.model';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { ApiService } from '../../service/api.service';
import { Template } from '../template-package/template.model';
import { WorkFunctionApiResponseInterface } from './interface/work-function-api-response.interface';

@Injectable()
export class WorkFunctionService {
    private path = '/workFunctions';
    // private cache: Cache = {};

    constructor(private apiService: ApiService) {  }

    getWorkFunctionsByTemplate(template: Template): Observable<WorkFunction[]> {
        return this.apiService.get(this.path, {templateId: template.id}).pipe(
            map((result: WorkFunctionApiResponseInterface[]) => result.map(response => this.makeWorkFunction(response, template)))
        );
    }

    private makeWorkFunction(data: WorkFunctionApiResponseInterface, template: Template): WorkFunction {
        const workFunction: WorkFunction = new WorkFunction();
        workFunction.id = data.id;
        workFunction.name = data.name;
        workFunction.isMainFunction = data.isMainFunction;
        workFunction.order = data.order;
        workFunction.template = template;
        return workFunction;
    }
}
