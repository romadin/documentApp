import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { BehaviorSubject, of, Subject } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import {
    ConfirmPopupComponent,
    ConfirmPopupData
} from '../../../construction-information-management-app/popups/confirm-popup/confirm-popup.component';
import { ToastService } from '../../toast.service';
import { Company } from '../company-package/company.model';
import { WorkFunction } from '../work-function-package/work-function.model';

import { Document } from './document.model';
import { ApiDocResponse, DocPostData, ParamDelete } from './api-document.interface';
import { ApiService } from '../../service/api.service';

interface DocumentsCache {
    [id: number]: Document;
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
    private documentsCache: DocumentsCache = {};
    private documentsByCompanyCache: DocumentsCacheByWorkFunction = {};
    private path = '/documents';

    constructor(private apiService: ApiService, private dialog: MatDialog, private toast: ToastService) { }

    getDocumentsByFolder(folderId: number): BehaviorSubject<Document[]> {
        const documents: BehaviorSubject<Document[]> = new BehaviorSubject([]);
        const params = { folderId: folderId, template: 'default' };

        this.apiService.get(this.path, params).subscribe((documentsResponse: ApiDocResponse[]) => {
                const documentsContainer: Document[] = [];

                documentsResponse.forEach((documentResponse: ApiDocResponse) => {
                    if (this.documentsCache[documentResponse.id]) {
                        documentsContainer.push(this.documentsCache[documentResponse.id]);
                        return;
                    }
                    const document = this.makeDocument(documentResponse);
                    documentsContainer.push(document);
                });

                documents.next(documentsContainer);
            });

        return documents;
    }

    getDocumentsByWorkFunction(workFunction: WorkFunction): BehaviorSubject<Document[]> {
        const param = {workFunctionId: workFunction.id};
        const documentsContainer: BehaviorSubject<Document[]> = new BehaviorSubject<Document[]>([]);
        this.apiService.get(this.path, param).subscribe((result: ApiDocResponse[]) => {
                const documents = result.map(response => this.makeDocument(response));
                documentsContainer.next(documents);
            });
        return documentsContainer;
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

    postDocument(postData: DocPostData, workFunction: WorkFunction, document?: Document): BehaviorSubject<Document> {
        const newDocument: BehaviorSubject<Document> = new BehaviorSubject(null);
        const param = {workFunctionId: workFunction.id};
        if (document) {
            param['documentId'] = document.id;
        }

        this.apiService.post(this.path, postData, param).subscribe((response: ApiDocResponse) => {
            newDocument.next(this.makeDocument(response));
        }, (error) => {
            newDocument.error(error.error);
        });

        return newDocument;
    }

    updateDocument(document: Document, postData: DocPostData, workFunction: WorkFunction): BehaviorSubject<Document> {
        const newDocument: BehaviorSubject<Document> = new BehaviorSubject(null);
        const param = {workFunctionId: workFunction.id};

        this.apiService.post(this.path + '/' + document.id, postData, param).subscribe((response: ApiDocResponse) => {
            this.updateDocumentModel(document, response);
            newDocument.next(document);
        }, (error) => {
            newDocument.error(error.error);
        });

        return newDocument;
    }

    deleteDocument(document: Document, paramDelete?: ParamDelete): Subject<boolean> {
        const deleted: Subject<boolean> = new Subject<boolean>();
        const popupData: ConfirmPopupData = {
            title: 'Document verwijderen',
            name: document.getName(),
            message: `Weet u zeker dat u <strong>${document.getName()}</strong> wilt verwijderen`,
            firstButton: 'ja',
            secondButton: 'nee'
        };
        this.dialog.open(ConfirmPopupComponent, {width: '400px', data: popupData}).afterClosed().subscribe((action) => {
            if (action) {
                this.apiService.delete(this.path + '/' + document.id, paramDelete).subscribe(() => {
                    if (this.documentsCache.hasOwnProperty(document.id) ) {
                        delete this.documentsCache[document.id];
                    }
                    this.toast.showSuccess('Document: ' + document.getName() + ' is verwijderd', 'Verwijderd');
                    deleted.next(true);
                });
            }
        });
        return deleted;
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

        this.documentsCache[doc.id] = doc;
        return doc;
    }
}
