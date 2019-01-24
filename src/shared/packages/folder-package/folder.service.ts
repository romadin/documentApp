import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

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

    constructor(private apiService: ApiService) { }

    public getFoldersByProject(projectId: number): Subject<Folder[]> {
        const folders: Subject<Folder[]> = new Subject();

        if ( this.foldersByProjectCache[projectId] ) {
            folders.next(this.foldersByProjectCache[projectId]);
            return folders;
        }

        this.apiService.get('/folders', {projectId: projectId}).subscribe((foldersResponse) => {
            const allFolders: Folder[] = [];
            foldersResponse.forEach((folder) => {
                allFolders.push(this.makeFolder(folder));
            });
            folders.next(allFolders);
        });

        return folders;
    }

    public makeFolder(folderData) {
        const folder = new Folder();
        folder.setId(folderData.id);
        folder.setName(folderData.name);
        folder.setProjectId(folderData.projectId);
        folder.setOn(folderData.on);

        this.setFoldersCache(folder);
        return folder;
    }

    private setFoldersCache(folder: Folder): void {
        if ( this.foldersByProjectCache[folder.getProjectId()] ) {
            this.foldersByProjectCache[folder.getProjectId()].push(folder);
        } else {
            this.foldersByProjectCache[folder.getProjectId()] = [folder];
        }
        this.foldersCache[folder.getId()] = folder;
    }
}
