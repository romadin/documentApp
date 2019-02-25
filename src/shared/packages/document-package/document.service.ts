import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

import { Document } from './document.model';
import { ApiDocResponse, DocPostData } from './api-document.interface';
import { ApiService } from '../../service/api.service';
import { Folder } from '../folder-package/folder.model';

interface DocumentsCache {
    [id: number]: Document;
}

@Injectable()
export class DocumentService {
    private documentsCache: DocumentsCache = {};

    constructor(private apiService: ApiService) { }

    public getDocuments(folderId: number): BehaviorSubject<Document[]> {
        const documents: BehaviorSubject<Document[]> = new BehaviorSubject([]);
        const params = { folderId: folderId, template: 'default' };

        this.apiService.get('/documents', params).subscribe((documentsResponse: ApiDocResponse[]) => {
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

    public postDocument(postData: DocPostData): BehaviorSubject<Document> {
        const newDocument: BehaviorSubject<Document> = new BehaviorSubject(null);

        this.apiService.post('/documents', postData).subscribe((response: ApiDocResponse) => {
            newDocument.next(this.makeDocument(response));
        }, (error) => {
            newDocument.error(error.error);
        });

        return newDocument;
    }

    public updateDocument(document: Document, postData: DocPostData): BehaviorSubject<Document> {
        const newDocument: BehaviorSubject<Document> = new BehaviorSubject(null);

        this.apiService.post('/documents/' + document.id, postData).subscribe((response: ApiDocResponse) => {
            this.updateDocumentModel(document, response);
            newDocument.next(document);
        }, (error) => {
            newDocument.error(error.error);
        });

        return newDocument;
    }

    public deleteDocument(document: Document): Subject<boolean> {
        const deleted: Subject<boolean> = new Subject<boolean>();
        this.apiService.delete('/documents/' + document.id, {}).subscribe((response: ApiDocResponse) => {
            if (this.documentsCache.hasOwnProperty(document.id) ) {
                delete this.documentsCache[document.id];
            }
            deleted.next(true );
        });
        return deleted;
    }

    public deleteDocumentLink(document: Document, folder: Folder) {
        const deleted: Subject<boolean> = new Subject<boolean>();
        this.apiService.delete('/folders/' + folder.id + '/documents/' + document.id, {}).subscribe((response: ApiDocResponse) => {
            if (this.documentsCache.hasOwnProperty(document.id) ) {
                delete this.documentsCache[document.id];
            }
            deleted.next(true );
        });
        return deleted;
    }

    /**
     * Update the current model with the new api data.
     */
    public updateDocumentModel(document: Document, data: ApiDocResponse): void {
        document.content = data.content;
        document.name = data.name;

        const newFolderIds = data.foldersId.filter((folderId) => {
            return document.parentFolders.find((id) => folderId !== id);
        });

        if ( newFolderIds ) {
            newFolderIds.forEach((folderId) => {
                document.parentFolders.push(folderId);
            });
        }
    }

    private makeDocument(data: ApiDocResponse): Document {
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
