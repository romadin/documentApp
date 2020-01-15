import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import {
    ConfirmPopupComponent,
    ConfirmPopupData
} from '../../../construction-information-management-app/popups/confirm-popup/confirm-popup.component';
import { ToastService } from '../../toast.service';
import { CompanyService } from '../company-package/company.service';
import { DocumentService } from '../document-package/document.service';
import { Project } from '../project-package/project.model';
import { WorkFunction } from './work-function.model';
import { map, mergeMap, shareReplay, take } from 'rxjs/operators';
import { BehaviorSubject, combineLatest, forkJoin, merge, Observable, of, Subject } from 'rxjs';

import { ApiService } from '../../service/api.service';
import { Template } from '../template-package/template.model';
import {
    WorkFunctionApiResponseInterface,
    WorkFunctionGetParam,
    WorkFunctionUpdateBody
} from './interface/work-function-api-response.interface';
import { ChapterService } from '../chapter-package/chapter.service';

interface WorkFunctionCache {
    [id: number]: WorkFunction;
}
@Injectable()
export class WorkFunctionService {
    private path = '/workFunctions';
    private cache: WorkFunctionCache = {};
    
    private workFunctionsProjectCache$: Observable<WorkFunction[]>[] = [];
    private workFunctionsTemplateCache$: Observable<WorkFunction[]>[] = [];
    private updateWorkFunctionsCache$: Subject<void> = new Subject<void>();
    
    
    constructor(private apiService: ApiService,
                private chapterService: ChapterService,
                private documentService: DocumentService,
                private companyService: CompanyService,
                private dialog: MatDialog,
                private toast: ToastService
    ) {  }

    getWorkFunctionsByParent(params: WorkFunctionGetParam, parent: Template): Observable<WorkFunction[]> {
        if (!this.workFunctionsTemplateCache$[parent.id]) {
            const initialWorkFunctions$ = this.getDataOnce(params, parent);
            const updates$ = this.updateWorkFunctionsCache$.pipe(mergeMap(() => this.getDataOnce(params, parent)));
            
            this.workFunctionsTemplateCache$[parent.id] = merge(initialWorkFunctions$, updates$);
        }
        return this.workFunctionsTemplateCache$[parent.id];
    }
    
    
    getWorkFunctionsByProject(params: WorkFunctionGetParam, parent: Project): Observable<WorkFunction[]> {
        if (!this.workFunctionsProjectCache$[parent.id]) {
            const initialWorkFunctions$ = this.getDataOnce(params, parent);
            const updates$ = this.updateWorkFunctionsCache$.pipe(mergeMap(() => this.getDataOnce(params, parent)));
            
            this.workFunctionsProjectCache$[parent.id] = merge(initialWorkFunctions$, updates$);
        }
        return this.workFunctionsProjectCache$[parent.id];
    }
    
    getDataOnce(params: WorkFunctionGetParam, parent: Template|Project) {
        return this.requestWorkFunctions(params, parent).pipe(shareReplay(1), take(1));
    }
    
    requestWorkFunctions(params: WorkFunctionGetParam, parent: Template|Project): Observable<WorkFunction[]> {
    
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
            map((result: WorkFunctionApiResponseInterface) => {
                this.updateWorkFunctionsCache$.next();
                return this.makeWorkFunction(result, parent);
            })
        );
    }

    updateWorkFunction(workFunction: WorkFunction, body: WorkFunctionUpdateBody): Observable<WorkFunction> {
        return this.apiService.post(this.path + '/' + workFunction.id, body).pipe(
            map((result: WorkFunctionApiResponseInterface) => {
                const updatedWorkFunction = this.updateWorkFunctionModel(workFunction, result, workFunction.parent);
                // const index = workFunction.parent.workFunctions.findIndex(w => w.id === workFunction.id);
                // workFunction.parent.workFunctions[index] = updatedWorkFunction;
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
                        this.toast.showSuccess('Functie: ' + workFunction.name + ' is verwijderd', 'Verwijderd');
                        this.updateWorkFunctionsCache$.next();
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
        workFunction.chapters = this.chapterService.getChaptersByWorkFunction(workFunction);
        workFunction.documents = this.documentService.getDocumentsByWorkFunction(workFunction);

        // combineLatest(data.documents.map(documentId => this.documentService.getDocument(documentId, {workFunctionId: workFunction.id})))
        //     .subscribe((documents) => {
        //         documents = documents.sort((a, b) => a.order - b.order);
        //         workFunction.documents.next(documents);
        // });

        const companies = [];
        data.companies.forEach(company => {
            companies.push(this.companyService.makeCompany(company, workFunction));
        });
        workFunction.companies = companies;

        this.cache[workFunction.id] = workFunction;

        return workFunction;
    }

    private updateWorkFunctionModel(work: WorkFunction, data: WorkFunctionApiResponseInterface, parent: Template|Project): WorkFunction {
        work.name = data.name;
        work.isMainFunction = data.isMainFunction;
        work.order = data.order;
        work.on = data.on;
        work.fromTemplate = data.fromTemplate;
        work.parent = parent;
        work.documents = this.documentService.getDocumentsByWorkFunction(work);

        this.cache[work.id] = work;

        return work;
    }
}
