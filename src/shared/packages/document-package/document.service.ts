import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { BehaviorSubject, combineLatest, merge, Observable, of, Subject } from 'rxjs';
import { map, mergeMap, shareReplay, take } from 'rxjs/operators';
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

interface DocumentsCache {
    [id: number]: Document;
}

interface DocumentCacheObservable {
    [id: number]: Subject<Document>;
}
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
    
    private documentsByIdCache: DocumentCacheObservable = {};
    private documentsByCompanyCache: DocumentsCacheByWorkFunction = {};
    
    private documentsWorkFunctionCache$: Observable<Document[]>[] = [];
    private updateDocumentsCache$: Subject<void> = new Subject<void>();

    constructor(private apiService: ApiService, private dialog: MatDialog, private toast: ToastService) { }

    getDocumentsByWorkFunction(workFunction: WorkFunction): Observable<Document[]> {
        if ( ! this.documentsWorkFunctionCache$[workFunction.id]) {
            const initialDocuments$ = this.getDataOnce(workFunction);
            const updates$ = this.updateDocumentsCache$.pipe(mergeMap(() => this.getDataOnce(workFunction)));

            this.documentsWorkFunctionCache$[workFunction.id] = merge(initialDocuments$, updates$);
        }

        return this.documentsWorkFunctionCache$[workFunction.id];
    }
    
    getDataOnce(workFunction: WorkFunction): Observable<Document[]> {
        const param = {workFunctionId: workFunction.id};
        return this.requestDocuments(param).pipe(shareReplay(1), take(1));
    }
    
    requestDocuments(param: {workFunctionId: number}): Observable<Document[]> {
        return this.apiService.get(this.path, param).pipe(
            map((response: ApiDocResponse[]) => response.map((result: ApiDocResponse) => this.makeDocument(result)))
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
            documentsContainer.next(result.map(response => this.makeDocument(response)));
        });

        this.documentsByCompanyCache[company.parent.id] = {[company.id] : documentsContainer};
        return this.documentsByCompanyCache[company.parent.id][company.id];
    }

    getDocument(id: number, param: DocGetParam): Subject<Document> {
        if (this.documentsByIdCache[id]) {
            return this.documentsByIdCache[id];
        }

        const document: Subject<Document> = new Subject<Document>();

        this.apiService.get(`${this.path}/${id}`, param).subscribe((result: ApiDocResponse) => {
            document.next(this.makeDocument(result));
        });

        this.documentsByIdCache[id] = document;
        return this.documentsByIdCache[id];
    }

    postDocument(postData: DocPostData, param: DocGetParam): BehaviorSubject<Document> {
        const newDocument: BehaviorSubject<Document> = new BehaviorSubject(null);

        this.apiService.post(this.path, postData, param).subscribe((response: ApiDocResponse) => {
            newDocument.next(this.makeDocument(response));
            this.updateDocumentsCache$.next();
        }, (error) => {
            newDocument.error(error.error);
        });

        return newDocument;
    }

    /**
     * Link existing documents in batch to a work function.
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

    deleteDocument(document: Document, paramDelete?: ParamDelete): Observable<boolean> {
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
                    this.toast.showSuccess('Document: ' + document.getName() + ' is verwijderd', 'Verwijderd');
                    this.updateDocumentsCache$.next();
                    return true;
                }));
            }
        }));
    }

    /**
     * Only delete the link between the document and workFunction.
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

    makeDocument(data: ApiDocResponse): Document {
        const doc = new Document();

        doc.id = data.id;
        doc.originalName = data.originalName;
        doc.name = data.name;
        doc.content = data.content;
        doc.parentFolders = data.foldersId;
        doc.order = data.order;
        doc.fromTemplate = data.fromTemplate;
        doc.documents = new BehaviorSubject([]);

        combineLatest(data.documents.map(documentId => this.getDocument(documentId, {documentId: doc.id}))).subscribe((documents) => {
            documents = documents.sort((a, b) => a.order - b.order);
            doc.documents.next(documents);
        });

        return doc;
    }
}
