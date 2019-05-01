import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { Template } from './template.model';
import { TemplateItem, templateItemType } from './templateItem.model';
import { ApiService } from '../../service/api.service';
import { Organisation } from '../organisation-package/organisation.model';
import { TemplateApiResponseInterface, TemplateItemInterface } from './interface/template-api-response.interface';

interface Cache {
    [id: number]: Template;
}

@Injectable()
export class TemplateService {
    private path = '/templates';
    private cache: Cache = {};
    constructor(private apiService: ApiService) {  }

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

    private makeTemplate(result: TemplateApiResponseInterface): Template {
        const template: Template = new Template();
        template.id = result.id;
        template.name = result.name;
        template.folders = result.folders.map(item => this.makeTemplateItem(item, 'folder'));
        template.subFolders = result.subFolders.map(item => this.makeTemplateItem(item, 'folder'));
        template.documents = result.documents.map(item => this.makeTemplateItem(item, 'document'));
        template.subDocuments = result.subDocuments;

        this.cache[template.id] = template;
        return template;
    }

    private makeTemplateItem(data: TemplateItemInterface, type: templateItemType): TemplateItem {
        const item: TemplateItem = new TemplateItem();
        item.name = data.name;
        item.content = data.content;
        item.order = data.order;
        item.type = type;

        return item;
    }
}
