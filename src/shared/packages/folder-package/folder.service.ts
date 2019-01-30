import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

import { Folder } from './folder.model';
import { ApiFolderResponse, FolderPostData } from './api-folder.interface';
import { ApiService } from '../../service/api.service';

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

    constructor(private apiService: ApiService) { }

    public getFoldersByProject(projectId: number): BehaviorSubject<Folder[]> {
        const folders: BehaviorSubject<Folder[]> = new BehaviorSubject([]);

        if ( this.foldersByProjectCache[projectId] ) {
            folders.next(this.foldersByProjectCache[projectId]);
            return folders;
        }

        this.apiService.get('/folders', {projectId: projectId}).subscribe((foldersResponse: ApiFolderResponse[]) => {
            const mainFolders: Folder[] = [];
            const subFolders: { [parentFolder: number]: Folder[] } = {};
            foldersResponse.forEach((folderResponse) => {
                const folder = this.makeFolder(folderResponse);

                if ( folderResponse.parentFolderId ) {
                    subFolders[folderResponse.parentFolderId] ?
                        subFolders[folderResponse.parentFolderId].push(folder) : subFolders[folderResponse.parentFolderId] = [folder];
                    return;
                }
                this.setFoldersByProjectCache(folder);
                mainFolders.push(folder);
            });

            for (const key in subFolders ) {
                if ( subFolders.hasOwnProperty(key) ) {
                    this.foldersCache[key].setSubFolders(subFolders[key]);
                }
            }

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
            throw error(error.error);
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
            throw error(error.error);
        });

        return folder;
    }

    public makeFolder(folderData) {
        const folder = new Folder();
        folder.setId(folderData.id);
        folder.setName(folderData.name);
        folder.setProjectId(folderData.projectId);
        folder.setOn(folderData.on);

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
}
