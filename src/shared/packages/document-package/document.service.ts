import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { BehaviorSubject, combineLatest, merge, Observable, of, Subject, timer } from 'rxjs';
import { map, mergeMap, shareReplay, switchMap, take } from 'rxjs/operators';
import {
    ConfirmPopupComponent,
    ConfirmPopupData
} from '../../../construction-information-management-app/popups/confirm-popup/confirm-popup.component';
import { ToastService } from '../../toast.service';
import { Company } from '../company-package/company.model';
import { WorkFunction } from '../work-function-package/work-function.model';

import { Document } from './document.model';
import { ApiDocResponse, DocGetParam, DocPostData, ParamDelete } from './api-document.interface';
import { ApiService } from '../../service/api.service';

interface DocumentsCacheObservable {
    [companyId: number]: BehaviorSubject<Document[]>;
}
interface DocumentsCacheByWorkFunction {
    [workFunctionId: number]: DocumentsCacheObservable;
}
export type DocumentParentUrl = '/folders/' | '/workFunctions/' | '/companies/';

@Injectable()
export class DocumentService {
    private path = '/documents';

    private documentsByCompanyCache: DocumentsCacheByWorkFunction = {};
    private documentCache: {[id: number]: Document} = {};

    private documentsWorkFunctionCache$: Observable<Document[]>[] = [];
    private updateDocumentsCache$: Subject<void> = new Subject<void>();

    private subDocumentsCache$: Observable<Document[]>[] = [];
    private updateSubDocumentsCache$: Subject<void> = new Subject<void>();

    constructor(private apiService: ApiService, private dialog: MatDialog, private toast: ToastService) { }

    getDocumentsByWorkFunction(workFunction: WorkFunction): Observable<Document[]> {
        if ( ! this.documentsWorkFunctionCache$[workFunction.id]) {
            const param = {workFunctionId: workFunction.id};
            const initialDocuments$ = this.getDataOnce(param);
            const updates$ = this.updateDocumentsCache$.pipe(mergeMap(() => this.getDataOnce(param)));

            this.documentsWorkFunctionCache$[workFunction.id] = merge(initialDocuments$, updates$).pipe(shareReplay(1));
        }

        return this.documentsWorkFunctionCache$[workFunction.id];
    }

    getDataOnce(param: DocGetParam, getSubDocuments = true): Observable<Document[]> {
        return this.requestDocuments(param, getSubDocuments).pipe(take(1));
    }

    requestDocuments(param: DocGetParam, getSubDocuments: boolean): Observable<Document[]> {
        return this.apiService.getInterface<ApiDocResponse[]>(this.path, param).pipe(
            map(response => response.map((result: ApiDocResponse) => this.makeDocument(result, getSubDocuments)))
        );
    }

    getDocumentsByCompany(company: Company): BehaviorSubject<Document[]> {
        if (!company.parent) {
            throw Error('company does not have a parent');
        }

        if (this.documentsByCompanyCache[company.parent.id] && this.documentsByCompanyCache[company.parent.id][company.id]) {
            return this.documentsByCompanyCache[company.parent.id][company.id];
        }
        const param = {companyId: company.id, workFunctionId: company.parent.id};
        const documentsContainer: BehaviorSubject<Document[]> = new BehaviorSubject<Document[]>([]);

        this.apiService.get(this.path, param).subscribe((result: ApiDocResponse[]) => {
            documentsContainer.next(result.map(response => this.makeDocument(response, true)));
        });

        this.documentsByCompanyCache[company.parent.id] = {[company.id] : documentsContainer};
        return this.documentsByCompanyCache[company.parent.id][company.id];
    }

    getSubDocuments(parentDocument: Document): Observable<Document[]> {
        if ( ! this.subDocumentsCache$[parentDocument.id]) {
            const param: DocGetParam = {documentId: parentDocument.id};
            const initialDocuments$ = this.getDataOnce(param, false);
            const updates$ = this.updateSubDocumentsCache$.pipe(mergeMap(() => this.getDataOnce(param, false)));

            this.subDocumentsCache$[parentDocument.id] = merge(initialDocuments$, updates$).pipe(shareReplay(1));
        }

        return this.subDocumentsCache$[parentDocument.id];
    }

    postDocument(postData: DocPostData, param: DocGetParam): Observable<Document> {
        return this.apiService.post(this.path, postData, param).pipe(map((response: ApiDocResponse) => {
            // check if we need to update the cache for the sub documents.
            param.documentId ? this.updateSubDocumentsCache$.next() : this.updateDocumentsCache$.next();
            return this.makeDocument(response, false);
        }));

    }

    /**
     * Link existing documents in a batch to the work function.
     */
    postDocuments(postData: {documents: number[]}, param: {workFunctionId: number}): Observable<string> {
        return this.apiService.post(this.path, postData, param).pipe(map((response: string) => {
            this.updateDocumentsCache$.next();
            return response;
        }));
    }

    updateDocument(document: Document, postData: DocPostData, param: DocGetParam): BehaviorSubject<Document> {
        const newDocument: BehaviorSubject<Document> = new BehaviorSubject(null);

        this.apiService.post(this.path + '/' + document.id, postData, param).subscribe((response: ApiDocResponse) => {
            this.updateDocumentModel(document, response);
            newDocument.next(document);
        }, (error) => {
            newDocument.error(error.error);
        });

        return newDocument;
    }

    deleteDocument(document: Document, paramDelete: ParamDelete): Observable<boolean> {
        const popupData: ConfirmPopupData = {
            title: 'Document verwijderen',
            name: document.getName(),
            message: `Weet u zeker dat u <strong>${document.getName()}</strong> wilt verwijderen`,
            firstButton: 'ja',
            secondButton: 'nee'
        };
        return this.dialog.open(ConfirmPopupComponent, {width: '400px', data: popupData}).afterClosed().pipe(mergeMap((action) => {
            if (action) {
                return this.apiService.delete(this.path + '/' + document.id, paramDelete).pipe(map(() => {
                    paramDelete.documentId ? this.updateSubDocumentsCache$.next() : this.updateDocumentsCache$.next();
                    this.toast.showSuccess('Document: ' + document.getName() + ' is verwijderd', 'Verwijderd');
                    return true;
                }));
            }
            return of(false);
        }));
    }

    /**
     * Only delete the link between the document and workFunction. We can never delete sub documents here.
     */
    deleteDocumentLink(url: DocumentParentUrl, document: Document, parent: Document | Company | WorkFunction ) {
        const popupData: ConfirmPopupData = {
            title: 'Document link verwijderen',
            name: document.getName(),
            message: `Weet u zeker dat u <strong>${document.getName()}</strong> wilt verwijderen`,
            firstButton: 'ja',
            secondButton: 'nee'
        };

        return this.dialog.open(ConfirmPopupComponent, {width: '400px', data: popupData}).afterClosed().pipe(mergeMap((action: boolean) => {
            if (action) {
                return this.apiService.delete(url + parent.id, {}).pipe(
                    map(() => {
                        this.toast.showSuccess('Document: ' + Document.name + 'link is verwijderd', 'Verwijderd');
                        this.updateDocumentsCache$.next();
                        return true;
                    })
                );
            }
            return of(false);
        }));
    }

    /**
     * Update the current model with the new api data.
     */
    updateDocumentModel(document: Document, data: ApiDocResponse): void {
        document.content = data.content;
        document.name = data.name;
    }

    makeDocument(data: ApiDocResponse, getSubDocuments: boolean): Document {
        if (this.documentCache[data.id]) {
            return this.documentCache[data.id];
        }
        const doc = new Document();

        doc.id = data.id;
        doc.originalName = data.originalName;
        doc.name = data.name;
        doc.content = data.content;
        doc.order = data.order;
        doc.fromTemplate = data.fromTemplate;
        doc.documents = getSubDocuments ? this.getSubDocuments(doc).pipe(map((documents) => documents.sort((a, b) => a.order - b.order)))
            : of();

        return doc;
    }
}
