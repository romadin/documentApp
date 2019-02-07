import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { find, map } from 'rxjs/operators';

import { Folder } from './folder.model';
import { ApiFolderResponse, FolderPostData } from './api-folder.interface';
import { ApiService } from '../../service/api.service';
import { DocumentService } from '../document-package/document.service';
import { Document} from '../document-package/document.model';

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

    public postFolder(data: FolderPostData, id: number): Subject<Folder> {
        const folder: Subject<Folder> = new Subject();

        this.apiService.post('/folders/' + id, data).subscribe((foldersResponse: ApiFolderResponse) => {
            if (this.foldersCache[id]) {
                return folder.next(this.foldersCache[id]);
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

    public getMainFolderFromProject(projectId: number) {
        return this.getFoldersByProject(projectId).pipe(map(folders => folders.find(folder => folder.getIsMainFolder())));
    }

    public makeFolder(folderData: ApiFolderResponse) {
        const folder = new Folder();
        folder.setId(folderData.id);
        folder.setName(folderData.name);
        folder.setProjectId(folderData.projectId);
        folder.setOn(folderData.on);
        folder.setIsMainFolder(folderData.isMain);

        folder.order = folderData.order;

        // check if sub folders exist then set the sub folder.
        if ( folderData.subFolders !== null && folderData.subFolders.length > 0 ) {
            folderData.subFolders.forEach((subFolderResponse) => {
                folder.setSubFolder(this.makeFolder(subFolderResponse));
            });
        }

        folder.setDocuments(this.documentService.getDocuments(folderData.id).pipe(map((documents) => documents )));

        this.foldersCache[folder.getId()] = folder;
        return folder;
    }

    private setFoldersByProjectCache(folder: Folder): void {
        if ( this.foldersByProjectCache[folder.getProjectId()] ) {
            this.foldersByProjectCache[folder.getProjectId()].push(folder);
        } else {
            this.foldersByProjectCache[folder.getProjectId()] = [folder];
        }
    }

    private updateFolder(folder: Folder, response: ApiFolderResponse) {
        folder.setDocuments(this.documentService.getDocuments(folder.getId()).pipe(map((documents) => documents )));
        return folder;
    }
}
