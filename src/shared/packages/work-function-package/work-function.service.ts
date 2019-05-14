import { Injectable } from '@angular/core';
import { WorkFunction } from './work-function.model';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { ApiService } from '../../service/api.service';
import { Template } from '../template-package/template.model';
import { WorkFunctionApiResponseInterface } from './interface/work-function-api-response.interface';

interface WorkFunctionCache {
    [id: number]: WorkFunction;
}
@Injectable()
export class WorkFunctionService {
    private path = '/workFunctions';
    private cache: WorkFunctionCache = {};

    constructor(private apiService: ApiService) {  }

    getWorkFunctionsByTemplate(template: Template): Observable<WorkFunction[]> {
        return this.apiService.get(this.path, {templateId: template.id}).pipe(
            map((result: WorkFunctionApiResponseInterface[]) => result.map(response => this.makeWorkFunction(response, template)))
        );
    }

    createWorkFunction(template: Template, body): Observable<WorkFunction> {
        return this.apiService.post(this.path, body).pipe(
            map((result: WorkFunctionApiResponseInterface) => this.makeWorkFunction(result, template))
        );
    }

    updateWorkFunction(workFunction: WorkFunction, body): Observable<WorkFunction> {
        return this.apiService.post(this.path + '/' + workFunction.id, body).pipe(
            map((result: WorkFunctionApiResponseInterface) => {
                const index = workFunction.template.workFunctions.findIndex(w => w.id === workFunction.id);
                const updatedWorkFunction = this.makeWorkFunction(result, workFunction.template);
                workFunction.template.workFunctions[index] = updatedWorkFunction;
                return updatedWorkFunction;
            })
        );
    }

    deleteWorkFunction(workFunction: WorkFunction): Observable<string> {
        return this.apiService.delete(this.path + '/' + workFunction.id, {}).pipe(
            map((result: string) => result )
        );
    }

    private makeWorkFunction(data: WorkFunctionApiResponseInterface, template: Template): WorkFunction {
        const workFunction: WorkFunction = new WorkFunction();
        workFunction.id = data.id;
        workFunction.name = data.name;
        workFunction.isMainFunction = data.isMainFunction;
        workFunction.order = data.order;
        workFunction.template = template;

        this.cache[workFunction.id] = workFunction;

        return workFunction;
    }
}
