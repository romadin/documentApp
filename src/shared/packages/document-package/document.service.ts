import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { Document } from './document.model';
import { ApiDocResponse, DocPostData } from './api-document.interface';
import { ApiService } from '../../service/api.service';

interface DocumentsByProjectCache {
    [projectId: number]: Document[];
}

interface DocumentsCache {
    [id: number]: Document;
}

@Injectable()
export class DocumentService {
    private documentsByFolderCache: DocumentsByProjectCache = {};
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

        this.documentsCache[doc.id] = doc;
        return doc;
    }

    private setCacheDocumentsByFolderId(document: Document, folderId: number): void {
        if ( this.documentsByFolderCache[folderId] ) {
            this.documentsByFolderCache[folderId].push(document);
        } else {
            this.documentsByFolderCache[folderId] = [document];
        }
    }
}
