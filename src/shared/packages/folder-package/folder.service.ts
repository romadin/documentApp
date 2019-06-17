import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApiDocResponse } from '../document-package/api-document.interface';
import { DocumentService } from '../document-package/document.service';
import { Document} from '../document-package/document.model';
import { WorkFunction } from '../work-function-package/work-function.model';
import { ApiFolderResponse, FolderPostData, NewFolderPostData } from './api-folder.interface';
import { ApiService } from '../../service/api.service';
import { Folder } from './folder.model';

interface FoldersByProjectCache {
    [projectId: number]: Folder[];
}

interface FoldersCache {
    [id: number]: Folder;
}

@Injectable()
export class FolderService {
    private foldersByProjectCache: FoldersByProjectCache = {};
    private foldersCache: FoldersCache = {};
    private path = '/folders/';

    constructor(private apiService: ApiService, private documentService: DocumentService) { }

    public getFoldersByWorkFunction(workFunction: WorkFunction): BehaviorSubject<Folder[]> {
        const folders: BehaviorSubject<Folder[]> = new BehaviorSubject([]);

        if ( this.foldersByProjectCache[workFunction.id] ) {
            folders.next(this.foldersByProjectCache[workFunction.id]);
            return folders;
        }

        this.apiService.get(this.path, {workFunctionId: workFunction.id}).subscribe((foldersResponse: ApiFolderResponse[]) => {
            const mainFolders: Folder[] = [];
            foldersResponse.forEach((folderResponse) => {
                const folder = this.makeFolder(folderResponse);
                mainFolders.push(folder);
            });

            folders.next(mainFolders);
        });

        return folders;
    }

    public getFolder(id: number): BehaviorSubject<Folder> {
        const folder: BehaviorSubject<Folder> = new BehaviorSubject(null);

        if ( this.foldersCache[id] ) {
            folder.next(this.foldersCache[id]);
            return folder;
        }
        this.apiService.get(this.path + id, {}).subscribe((folderResponse: ApiFolderResponse) => {
            folder.next(this.makeFolder(folderResponse));
        }, (error) => {
            throw new Error(error.error);
        });

        return folder;
    }

    public createFolder(data: NewFolderPostData, workFunction: WorkFunction): Subject<Folder> {
        const folder: Subject<Folder> = new Subject();
        const param = {workFunctionId: workFunction.id};

        this.apiService.post(this.path, data, param).subscribe((foldersResponse: ApiFolderResponse) => {
            folder.next(this.makeFolder(foldersResponse));
        }, (error) => {
            throw new Error(error.error);
        });

        return folder;
    }


    public postFolder(id: number, data: FolderPostData, workFunction: WorkFunction): Subject<Folder> {
        const folder: Subject<Folder> = new Subject();
        const param = {workFunctionId: workFunction.id};

        this.apiService.post(this.path + id, data, param).subscribe((foldersResponse: ApiFolderResponse) => {
            if (this.foldersCache[id]) {
                return folder.next(this.updateFolder(this.foldersCache[id], foldersResponse));
            }
            folder.next(this.makeFolder(foldersResponse));
        }, (error) => {
            throw new Error(error.error);
        });

        return folder;
    }

    public postFolderLinkItems(id: number, items): Subject<Folder> {
        const folder: Subject<Folder> = new Subject();
        const documentsId: number[] = [];
        items.forEach((item) => {
            // @todo need to remove the if, when i can link folder to folder.
            if (item instanceof Document) {
                documentsId.push(item.id);
            }
        });
        const body = {documentsId: documentsId};
        this.apiService.post(this.path + id + '/documents', body).subscribe((foldersResponse: ApiFolderResponse) => {
            if (this.foldersCache[id]) {
                return folder.next(this.updateFolder(this.foldersCache[id], foldersResponse));
            }
            folder.next(this.makeFolder(foldersResponse));
        }, (error) => {
            throw new Error(error.error);
        });
        return folder;
    }

    public deleteFolder(folder: Folder, params: any): Subject<boolean> {
        const deleted: Subject<boolean> = new Subject<boolean>();
        this.apiService.delete(this.path + folder.id, params).subscribe((response: ApiDocResponse) => {
            if (this.foldersCache.hasOwnProperty(folder.id) ) {
                delete this.foldersCache[folder.id];
            }
            deleted.next(true );
        });
        return deleted;
    }

    public makeFolder(folderData: ApiFolderResponse) {
        if ( this.foldersCache[folderData.id] ) {
            return this.foldersCache[folderData.id];
        }

        const folder = new Folder();
        folder.id = folderData.id;
        folder.name = folderData.name;

        folder.order = folderData.order;
        folder.fromTemplate = folderData.fromTemplate;
        this.foldersCache[folder.id] = folder;

        // check if sub folder exist then set the sub workFunction-app.
        if ( folderData.subFolders !== null && folderData.subFolders.length > 0 ) {
            folderData.subFolders.forEach((subFolderResponse) => {
                folder.subFolder = this.makeFolder(subFolderResponse);
            });
        }

        folder.documents = this.documentService.getDocumentsByFolder(folderData.id);

        return folder;
    }

    private updateFolder(folder: Folder, response: ApiFolderResponse) {
        // check if sub folder exist then set the sub workFunction-app.
        if ( response.subFolders !== null && response.subFolders.length > 0 ) {
            const subFolders: Folder[] = [];
            response.subFolders.forEach((subFolderResponse) => {
                subFolders.push(this.makeFolder(subFolderResponse));
            });
            folder.subFolders = subFolders;
        }

        folder.documents = this.documentService.getDocumentsByFolder(folder.id);
        folder.name = response.name;
        return folder;
    }
}
