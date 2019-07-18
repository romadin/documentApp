import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { BehaviorSubject, Subject } from 'rxjs';

import {
    ConfirmPopupComponent,
    ConfirmPopupData
} from '../../../construction-information-management-app/popups/confirm-popup/confirm-popup.component';
import { Company } from '../company-package/company.model';
import { WorkFunction } from '../work-function-package/work-function.model';
import { ApiService } from '../../service/api.service';
import { ApiFolderResponse, FolderPostData, NewFolderPostData } from './api-folder.interface';
import { Folder } from './folder.model';
import { DocumentService } from '../document-package/document.service';
import { ApiDocResponse } from '../document-package/api-document.interface';

interface FoldersParentCache {
    [id: number]: BehaviorSubject<Folder[]>;
}

interface FoldersCache {
    [id: number]: Folder;
}

@Injectable()
export class FolderService {
    private foldersByFunctionCacheOB: FoldersParentCache = {};
    private foldersCompanyCacheOB: FoldersParentCache = {};
    private foldersCache: FoldersCache = {};
    private path = '/folders';

    constructor(private apiService: ApiService, private documentService: DocumentService, private dialog: MatDialog) { }

    public getFoldersByWorkFunction(workFunction: WorkFunction): BehaviorSubject<Folder[]> {
        if ( this.foldersByFunctionCacheOB[workFunction.id] ) {
            return this.foldersByFunctionCacheOB[workFunction.id];
        }
        const folders: BehaviorSubject<Folder[]> = new BehaviorSubject([]);

        this.apiService.get(this.path, {workFunctionId: workFunction.id}).subscribe((foldersResponse: ApiFolderResponse[]) => {
            folders.next(foldersResponse.map(folderResponse => this.makeFolder(folderResponse)));
        }, (e) => {
            console.log(e);
        });
        return this.foldersByFunctionCacheOB[workFunction.id] = folders;
    }

    public getFoldersByWorkFunctionId(workFunctionId: number): BehaviorSubject<Folder[]> {
        const folders: BehaviorSubject<Folder[]> = new BehaviorSubject([]);

        this.apiService.get(this.path, {workFunctionId: workFunctionId}).subscribe((foldersResponse: ApiFolderResponse[]) => {
            folders.next(foldersResponse.map(folderResponse => this.makeFolder(folderResponse)));
        }, (e) => {
            console.log(e);
        });


        return this.foldersByFunctionCacheOB[workFunctionId] = folders;
    }

    public getFoldersByCompany(company: Company): BehaviorSubject<Folder[]> {
        if ( this.foldersCompanyCacheOB[company.id] ) {
            return this.foldersCompanyCacheOB[company.id];
        }
        const folders: BehaviorSubject<Folder[]> = new BehaviorSubject([]);

        this.apiService.get(this.path, {companyId: company.id}).subscribe((foldersResponse: ApiFolderResponse[]) => {
            folders.next(foldersResponse.map(folderResponse => this.makeFolder(folderResponse)));
        });
        return this.foldersCompanyCacheOB[company.id] = folders;
    }

    public getFolder(id: number): BehaviorSubject<Folder> {
        const folder: BehaviorSubject<Folder> = new BehaviorSubject(null);

        if ( this.foldersCache[id] ) {
            folder.next(this.foldersCache[id]);
            return folder;
        }
        this.apiService.get(this.path + '/' + id, {}).subscribe((folderResponse: ApiFolderResponse) => {
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

        this.apiService.post(this.path + '/' + id, data, param).subscribe((foldersResponse: ApiFolderResponse) => {
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
        const popupData: ConfirmPopupData = {
            title: 'Hoofdstuk verwijderen',
            name: folder.name,
            message: `Weet u zeker dat u <strong>${folder.name}</strong> wilt verwijderen`,
            firstButton: 'ja',
            secondButton: 'nee'
        };
        this.dialog.open(ConfirmPopupComponent, {width: '400px', data: popupData}).afterClosed().subscribe((action) => {
            if (action) {
                this.apiService.delete(this.path + '/' + folder.id, params).subscribe((response: ApiDocResponse) => {
                    if (this.foldersCache.hasOwnProperty(folder.id) ) {
                        delete this.foldersCache[folder.id];
                    }
                    deleted.next(true );
                });
            }
        });
        return deleted;
    }

    public makeFolder(folderData: ApiFolderResponse) {
        const folder = new Folder();
        folder.id = folderData.id;
        folder.name = folderData.name;

        folder.order = folderData.order;
        folder.fromTemplate = folderData.fromTemplate;
        this.foldersCache[folder.id] = folder;

        folder.documents = this.documentService.getDocumentsByFolder(folderData.id);

        return folder;
    }

    private updateFolder(folder: Folder, response: ApiFolderResponse) {
        // check if sub workFunction exist then set the sub workFunction-app.
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
