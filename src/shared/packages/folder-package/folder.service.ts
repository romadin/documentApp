import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { find, map } from 'rxjs/operators';

import { Folder } from './folder.model';
import { ApiFolderResponse, FolderPostData, NewFolderPostData } from './api-folder.interface';
import { ApiService } from '../../service/api.service';
import { DocumentService } from '../document-package/document.service';
import { Document} from '../document-package/document.model';
import { ApiDocResponse } from '../document-package/api-document.interface';

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

    constructor(private apiService: ApiService, private documentService: DocumentService) { }

    public getFoldersByProject(projectId: number): BehaviorSubject<Folder[]> {
        const folders: BehaviorSubject<Folder[]> = new BehaviorSubject([]);

        if ( this.foldersByProjectCache[projectId] ) {
            folders.next(this.foldersByProjectCache[projectId]);
            return folders;
        }

        this.apiService.get('/folders', {projectId: projectId}).subscribe((foldersResponse: ApiFolderResponse[]) => {
            const mainFolders: Folder[] = [];
            foldersResponse.forEach((folderResponse) => {
                const folder = this.makeFolder(folderResponse);
                this.setFoldersByProjectCache(folder);
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
        this.apiService.get('/folders/' + id, {}).subscribe((folderResponse: ApiFolderResponse) => {
            folder.next(this.makeFolder(folderResponse));
        }, (error) => {
            throw new Error(error.error);
        });

        return folder;
    }

    public createFolder(data: NewFolderPostData): Subject<Folder> {
        const folder: Subject<Folder> = new Subject();

        this.apiService.post('/folders', data).subscribe((foldersResponse: ApiFolderResponse) => {
            folder.next(this.makeFolder(foldersResponse));
        }, (error) => {
            throw new Error(error.error);
        });

        return folder;
    }


    public postFolder(id: number, data: FolderPostData): Subject<Folder> {
        const folder: Subject<Folder> = new Subject();

        this.apiService.post('/folders/' + id, data).subscribe((foldersResponse: ApiFolderResponse) => {
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
            // @todo need to remove the if, when i can link folders to folders.
            if (item instanceof Document) {
                documentsId.push(item.id);
            }
        });
        const body = {documentsId: documentsId};
        this.apiService.post('/folders/' + id + '/documents', body).subscribe((foldersResponse: ApiFolderResponse) => {
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
        this.apiService.delete('/folders/' + folder.id, params).subscribe((response: ApiDocResponse) => {
            if (this.foldersCache.hasOwnProperty(folder.id) ) {
                delete this.foldersCache[folder.id];
            }
            deleted.next(true );
        });
        return deleted;
    }

    public getMainFolderFromProject(projectId: number) {
        return this.getFoldersByProject(projectId).pipe(map(folders => folders.find(folder => folder.isMainFolder)));
    }

    public makeFolder(folderData: ApiFolderResponse) {
        if ( this.foldersCache[folderData.id] ) {
            return this.foldersCache[folderData.id];
        }

        const folder = new Folder();
        folder.id = folderData.id;
        folder.name = folderData.name;
        folder.projectId = folderData.projectId;
        folder.isOn = folderData.on;
        folder.isMainFolder = folderData.isMain;

        folder.order = folderData.order;
        folder.fromTemplate = folderData.fromTemplate;
        this.foldersCache[folder.id] = folder;

        const parentsFolders: Folder[] = [];
        folderData.parentFoldersId.forEach((parentId) => {
            this.getFolder(parentId).subscribe((parentFolder: Folder) => {
                if (parentFolder) {
                    parentsFolders.push(parentFolder);
                    folder.parentFolders.next(parentsFolders);
                }
            });
        });

        // check if sub folders exist then set the sub folder-app.
        if ( folderData.subFolders !== null && folderData.subFolders.length > 0 ) {
            folderData.subFolders.forEach((subFolderResponse) => {
                folder.subFolder = this.makeFolder(subFolderResponse);
            });
        }

        folder.documents = this.documentService.getDocuments(folderData.id);

        return folder;
    }

    private setFoldersByProjectCache(folder: Folder): void {
        if ( this.foldersByProjectCache[folder.projectId] ) {
            this.foldersByProjectCache[folder.projectId].push(folder);
        } else {
            this.foldersByProjectCache[folder.projectId] = [folder];
        }
    }

    private updateFolder(folder: Folder, response: ApiFolderResponse) {
        // check if sub folders exist then set the sub folder-app.
        if ( response.subFolders !== null && response.subFolders.length > 0 ) {
            const subFolders: Folder[] = [];
            response.subFolders.forEach((subFolderResponse) => {
                subFolders.push(this.makeFolder(subFolderResponse));
            });
            folder.subFolders = subFolders;
        }

        folder.documents = this.documentService.getDocuments(folder.id);
        return folder;
    }
}
