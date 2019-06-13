import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { Template } from './template.model';
import { ApiService } from '../../service/api.service';
import { Organisation } from '../organisation-package/organisation.model';
import {
    TemplateApiResponseInterface,
    TemplatePostData
} from './interface/template-api-response.interface';
import { WorkFunctionService } from '../work-function-package/work-function.service';

interface Cache {
    [id: number]: Template;
}

@Injectable()
export class TemplateService {
    private path = '/templates';
    private cache: Cache = {};
    constructor(private apiService: ApiService, private workFunctionService: WorkFunctionService) {  }

    getTemplates(organisation: Organisation): Observable<Template[]> {
        return this.apiService.get(this.path, {organisationId: organisation.id}).pipe(
            map((result: TemplateApiResponseInterface[]) => result.map(response => this.makeTemplate(response)))
        );
    }

    getTemplate(id: number): Observable<Template> {
        if (this.cache[id]) {
            return of(this.cache[id]);
        }

        return this.apiService.get(this.path, {}).pipe(
            map((result: TemplateApiResponseInterface) => this.makeTemplate(result))
        );
    }

    postTemplate(body: TemplatePostData): Observable<Template> {
        return this.apiService.post(this.path, body).pipe(
            map((result: TemplateApiResponseInterface) => this.makeTemplate(result))
        );
    }

    updateTemplate(template: Template, body): Observable<Template> {
        return this.apiService.post(this.path + '/' + template.id, body).pipe(
            map((result: TemplateApiResponseInterface) => this.makeTemplate(result))
        );
    }

    deleteTemplate(template: Template): Observable<string> {
        if (template.organisationId !== 0) {
            return this.apiService.delete(this.path + '/' + template.id, {}).pipe(
                map((result: string) => result )
            );
        }
    }

    private makeTemplate(result: TemplateApiResponseInterface): Template {
        const template: Template = new Template();
        template.id = result.id;
        template.name = result.name;
        template.organisationId = result.organisationId;
        template.isDefault = result.isDefault;
        this.workFunctionService.getWorkFunctionsByParent({templateId: template.id}, template).subscribe(workFunctions => {
            workFunctions = workFunctions.sort((a, b) => a.order - b.order);
            template.workFunctions = workFunctions;
        });

        this.cache[template.id] = template;
        return template;
    }
}
