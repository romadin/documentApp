import { Injectable } from '@angular/core';
import { DocumentService } from '../document-package/document.service';
import { FolderService } from '../folder-package/folder.service';
import { Project } from '../project-package/project.model';
import { WorkFunction } from './work-function.model';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { ApiService } from '../../service/api.service';
import { Template } from '../template-package/template.model';
import {
    WorkFunctionApiResponseInterface,
    WorkFunctionGetParam,
    WorkFunctionUpdateBody
} from './interface/work-function-api-response.interface';
import { HeadlineService } from '../headline-package/headline.service';
import { ChapterService } from '../chapter-package/chapter.service';

interface WorkFunctionCache {
    [id: number]: WorkFunction;
}
@Injectable()
export class WorkFunctionService {
    private path = '/workFunctions';
    private cache: WorkFunctionCache = {};

    constructor(private apiService: ApiService,
                private headlineService: HeadlineService,
                private chapterService: ChapterService,
                private documentService: DocumentService,
                private foldersService: FolderService,
    ) {  }

    getWorkFunctionsByParent(params: WorkFunctionGetParam, parent: Template|Project): Observable<WorkFunction[]> {
        return this.apiService.get(this.path, params).pipe(
            map((result: WorkFunctionApiResponseInterface[]) => result.map(response => this.makeWorkFunction(response, parent)))
        );
    }

    getWorkFunction(id: number, parent: Template|Project): Observable<WorkFunction> {
        return this.apiService.get(this.path + '/' + id, {}).pipe(
            map((result: WorkFunctionApiResponseInterface) => this.makeWorkFunction(result, parent))
        );
    }

    createWorkFunction(parent: Template|Project, body): Observable<WorkFunction> {
        return this.apiService.post(this.path, body).pipe(
            map((result: WorkFunctionApiResponseInterface) => this.makeWorkFunction(result, parent))
        );
    }

    updateWorkFunction(workFunction: WorkFunction, body: WorkFunctionUpdateBody): Observable<WorkFunction> {
        return this.apiService.post(this.path + '/' + workFunction.id, body).pipe(
            map((result: WorkFunctionApiResponseInterface) => {
                const index = workFunction.parent.workFunctions.findIndex(w => w.id === workFunction.id);
                const updatedWorkFunction = this.makeWorkFunction(result, workFunction.parent);
                workFunction.parent.workFunctions[index] = updatedWorkFunction;
                return updatedWorkFunction;
            })
        );
    }

    deleteWorkFunction(workFunction: WorkFunction): Observable<string> {
        return this.apiService.delete(this.path + '/' + workFunction.id, {}).pipe(
            map((result: string) => result )
        );
    }

    private makeWorkFunction(data: WorkFunctionApiResponseInterface, parent: Template|Project): WorkFunction {
        const workFunction: WorkFunction = new WorkFunction();
        workFunction.id = data.id;
        workFunction.name = data.name;
        workFunction.isMainFunction = data.isMainFunction;
        workFunction.order = data.order;
        workFunction.parent = parent;
        workFunction.headlines = this.headlineService.getHeadlinesByWorkFunction(workFunction);
        workFunction.chapters = this.chapterService.getChaptersByWorkFunction(workFunction);
        workFunction.folders = this.foldersService.getFoldersByWorkFunction(workFunction);
        workFunction.documents = this.documentService.getDocumentsByWorkFunction(workFunction);

        this.cache[workFunction.id] = workFunction;

        return workFunction;
    }
}
