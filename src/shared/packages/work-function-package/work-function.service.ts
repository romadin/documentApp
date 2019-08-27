import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import {
    ConfirmPopupComponent,
    ConfirmPopupData
} from '../../../construction-information-management-app/popups/confirm-popup/confirm-popup.component';
import { ToastService } from '../../toast.service';
import { CompanyService } from '../company-package/company.service';
import { DocumentService } from '../document-package/document.service';
import { FolderService } from '../folder-package/folder.service';
import { Project } from '../project-package/project.model';
import { WorkFunction } from './work-function.model';
import { map, mergeMap } from 'rxjs/operators';
import { BehaviorSubject, Observable, of } from 'rxjs';

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
                private companyService: CompanyService,
                private dialog: MatDialog,
                private toast: ToastService
    ) {  }

    getWorkFunctionsByParent(params: WorkFunctionGetParam, parent: Template|Project): Observable<WorkFunction[]> {
        // const workFunctions: BehaviorSubject<WorkFunction[]> = new BehaviorSubject<WorkFunction[]>(null);

        return this.apiService.get(this.path, params).pipe(
            map((result: WorkFunctionApiResponseInterface[]) => result.map(response => {
                return this.cache[response.id] ? this.cache[response.id] : this.makeWorkFunction(response, parent);
            }))
        );

        // return workFunctions
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
                const updatedWorkFunction = this.updateWorkFunctionModel(workFunction, result, workFunction.parent);
                const index = workFunction.parent.workFunctions.findIndex(w => w.id === workFunction.id);
                workFunction.parent.workFunctions[index] = updatedWorkFunction;
                return updatedWorkFunction;
            })
        );
    }

    deleteWorkFunction(workFunction: WorkFunction, parent: Template|Project): Observable<boolean> {
        const popupData: ConfirmPopupData = {
            title: 'Functie verwijderen',
            name: workFunction.name,
            message: `Weet u zeker dat u <strong>${workFunction.name}</strong> wilt verwijderen`,
            firstButton: 'ja',
            secondButton: 'nee'
        };

        return this.dialog.open(ConfirmPopupComponent, {width: '400px', data: popupData}).afterClosed().pipe(mergeMap((action: boolean) => {
            if (action) {
                return this.apiService.delete(this.path + '/' + workFunction.id, {}).pipe(
                    map(() => {
                        parent.workFunctions.splice(
                            parent.workFunctions.findIndex(w => w.id === workFunction.id),
                            1
                        );
                        this.toast.showSuccess('Functie: ' + workFunction.name + ' is verwijderd', 'Verwijderd');
                        return true;
                    })
                );
            }
            return of(false);
        }));
    }

    private makeWorkFunction(data: WorkFunctionApiResponseInterface, parent: Template|Project): WorkFunction {
        const workFunction: WorkFunction = new WorkFunction();
        workFunction.id = data.id;
        workFunction.name = data.name;
        workFunction.isMainFunction = data.isMainFunction;
        workFunction.order = data.order;
        workFunction.on = data.on;
        workFunction.fromTemplate = data.fromTemplate;
        workFunction.parent = parent;
        workFunction.headlines = this.headlineService.getHeadlinesByWorkFunction(workFunction);
        workFunction.chapters = this.chapterService.getChaptersByWorkFunction(workFunction);
        workFunction.folders = this.foldersService.getFoldersByWorkFunction(workFunction);
        workFunction.documents = this.documentService.getDocumentsByWorkFunction(workFunction);
        workFunction.items = workFunction.getItems();

        const companies = [];
        data.companies.forEach(company => {
            companies.push(this.companyService.makeCompany(company, workFunction));
        });
        workFunction.companies = companies;

        this.cache[workFunction.id] = workFunction;

        return workFunction;
    }

    private updateWorkFunctionModel(work: WorkFunction, data: WorkFunctionApiResponseInterface, parent: Template|Project): WorkFunction {
        work.id = data.id;
        work.name = data.name;
        work.isMainFunction = data.isMainFunction;
        work.order = data.order;
        work.on = data.on;
        work.fromTemplate = data.fromTemplate;
        work.parent = parent;
        work.folders = this.foldersService.getFoldersByWorkFunction(work);
        work.documents = this.documentService.getDocumentsByWorkFunction(work);

        this.cache[work.id] = work;

        return work;
    }
}
