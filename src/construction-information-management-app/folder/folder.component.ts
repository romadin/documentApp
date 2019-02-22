import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';

import { RouterService } from '../../shared/service/router.service';
import { FolderService } from '../../shared/packages/folder-package/folder.service';
import { Folder } from '../../shared/packages/folder-package/folder.model';
import { DocumentService } from '../../shared/packages/document-package/document.service';
import { Document } from '../../shared/packages/document-package/document.model';
import { UserService } from '../../shared/packages/user-package/user.service';
import { User } from '../../shared/packages/user-package/user.model';
import { HeaderWithFolderCommunicationService } from '../../shared/packages/communication/HeaderWithFolder.communication.service';
import { FolderCommunicationService } from '../../shared/packages/communication/Folder.communication.service';

@Component({
  selector: 'cim-folder',
  templateUrl: './folder.component.html',
  styleUrls: ['./folder.component.css']
})
export class FolderComponent implements OnInit, OnDestroy {
    public documents: Document[];
    public currentFolder: Folder;
    public mainFolder: Folder;
    public currentUser: User;
    public documentToEdit: Document;
    public showAddItemList: boolean;
    public items: (Document | Folder)[];
    public partnerIsOpen = false;
    public showCreateNewItem: boolean;

    private itemsSubscription: Subject<(Document | Folder)[]> = new Subject<(Document | Folder)[]>();

    constructor(private folderService: FolderService,
                private documentService: DocumentService,
                private userService: UserService,
                private activatedRoute: ActivatedRoute,
                private routerService: RouterService,
                private headerCommunicationService: HeaderWithFolderCommunicationService,
                private folderCommunicationServce: FolderCommunicationService) { }

    ngOnInit() {
        const folderId: number = parseInt(this.activatedRoute.snapshot.paramMap.get('id'), 10);

        this.routerService.setBackRouteParentFromActivatedRoute(this.activatedRoute.parent);

        this.userService.getCurrentUser().subscribe((user: User) => {
            this.currentUser = user;
        });
        this.itemsSubscription.subscribe((items: (Document | Folder)[]) => {
            this.items = items;
        });

        this.headerCommunicationService.triggerAddFolder.subscribe((trigger: boolean) => {
            if (trigger) {
                this.addItem();
            }
        });

        this.folderCommunicationServce.onDocumentEditListener.subscribe((onClose: boolean) => {
            if (onClose) {
                this.showCreateNewItem = !onClose;
            }
        });

        this.getItems(folderId);
    }

    ngOnDestroy() {
        this.headerCommunicationService.triggerAddFolder.next(false);
    }

    public onDocumentEdit(document: Document) {
        this.documentToEdit = document;
        this.showAddItemList = false;
        this.showCreateNewItem = false;
    }

    public onDocumentEditClose(closeForm: boolean) {
        if (closeForm) {
            this.documentToEdit = null;
        }
    }

    public onItemsAdded(folder: Folder): void {
        this.setNewItems(folder);
        this.currentFolder = folder;
        this.showAddItemList = false;
        this.headerCommunicationService.triggerAddFolder.next(false);
    }

    public onAddItemsCancel(cancelList: boolean) {
        this.showAddItemList = !cancelList;
        this.headerCommunicationService.triggerAddFolder.next(false);
    }

    public addItem() {
        this.documentToEdit = undefined;
        this.partnerIsOpen = false;
        if (this.currentFolder && this.currentFolder.isMainFolder) {
            this.showCreateNewItem = true;
            return;
        }
        this.showAddItemList = true;
    }

    public showAllPartners(event: MouseEvent) {
        event.stopPropagation();
        event.preventDefault();
        this.documentToEdit = undefined;
        this.showCreateNewItem = false;
        this.partnerIsOpen = true;
    }

    public checkItemIsFolder(item): boolean {
        return item instanceof Folder;
    }

    private getItems(folderId: number): void {
        this.folderService.getFolder(folderId).subscribe((folder: Folder) => {
            if (folder) {
                this.currentFolder = folder;
                this.currentFolder.getDocuments().subscribe((documents) => {
                    let itemsContainer: (Document | Folder)[];
                    itemsContainer = documents;
                    itemsContainer = itemsContainer.concat(this.currentFolder.getSubFolders());
                    itemsContainer.sort((a: Document | Folder, b: Document | Folder ) => a.order - b.order);
                    this.itemsSubscription.next(itemsContainer);
                });
                this.folderService.getMainFolderFromProject(folder.getProjectId()).subscribe((mainFolder: Folder) => {
                    this.mainFolder = mainFolder;
                });
            }
        });
    }

    private setNewItems(folder: Folder) {
        folder.getDocuments().subscribe((documents) => {
            let itemsContainer: (Document | Folder)[];
            itemsContainer = documents;
            itemsContainer = itemsContainer.concat(folder.getSubFolders());
            itemsContainer.sort((a: Document | Folder, b: Document | Folder ) => a.order - b.order);
            this.itemsSubscription.next(itemsContainer);
        });
    }
}
