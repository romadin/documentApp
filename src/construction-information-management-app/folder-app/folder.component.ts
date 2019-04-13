import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, Subscription } from 'rxjs';

import { RouterService } from '../../shared/service/router.service';
import { FolderService } from '../../shared/packages/folder-package/folder.service';
import { Folder } from '../../shared/packages/folder-package/folder.model';
import { DocumentService } from '../../shared/packages/document-package/document.service';
import { Document } from '../../shared/packages/document-package/document.model';
import { UserService } from '../../shared/packages/user-package/user.service';
import { User } from '../../shared/packages/user-package/user.model';
import { HeaderWithFolderCommunicationService } from '../../shared/service/communication/HeaderWithFolder.communication.service';
import { FolderCommunicationService } from '../../shared/service/communication/Folder.communication.service';
import { ActiveItemPackage } from './folder-detail/folder-detail.component';
import { ScrollingService } from '../../shared/service/scrolling.service';

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
    public items: (Document | Folder)[];
    public showCreateNewItem: boolean;
    public showReadMode: boolean;
    public showReadModeAnimation: boolean;
    public activeItem: ActiveItemPackage;

    private itemsSubscription: Subject<(Document | Folder)[]> = new Subject<(Document | Folder)[]>();
    private subscriptions: Subscription[] = [];

    constructor(private folderService: FolderService,
                private documentService: DocumentService,
                private userService: UserService,
                private activatedRoute: ActivatedRoute,
                private routerService: RouterService,
                private headerCommunicationService: HeaderWithFolderCommunicationService,
                private folderCommunicationService: FolderCommunicationService,
    ) { }

    ngOnInit() {
        const folderId: number = parseInt(this.activatedRoute.snapshot.paramMap.get('id'), 10);

        this.routerService.setBackRouteParentFromActivatedRoute(this.activatedRoute.parent);

        this.subscriptions.push(this.userService.getCurrentUser().subscribe((user: User) => {
            this.currentUser = user;
        }));
        this.subscriptions.push(this.itemsSubscription.subscribe((items: (Document | Folder)[]) => {
            this.items = items;
        }));

        this.subscriptions.push(this.headerCommunicationService.triggerAddItem.subscribe((trigger: boolean) => {
            if (trigger) {
                this.addItem();
            }
        }));

        this.subscriptions.push(this.headerCommunicationService.triggerReadMode.subscribe((read: boolean) => {
            this.resetView();
            this.showReadMode = this.showReadModeAnimation = read;
        }));

        this.subscriptions.push(this.folderCommunicationService.onItemCloseListener.subscribe((onClose: boolean) => {
            if (onClose) {
                this.resetView();
            }
        }));

        this.headerCommunicationService.showAddUserButton.next(false);
        this.getItems(folderId);
    }

    ngOnDestroy() {
        this.headerCommunicationService.triggerAddItem.next(false);
        this.subscriptions.map(s => s.unsubscribe());
    }

    onFolderDeleted(folder: Folder) {
        this.items.splice(this.items.findIndex((item) => item === folder), 1);
    }

    onCloseReadMode(close: boolean) {
        this.showReadModeAnimation = !close;
        setTimeout(() => {
            this.showReadMode = !close;
        }, 900);
    }

    onCloseRightSide(close: boolean): void {
        this.resetView();
    }

    public onItemView(component: string, item?: Document | Folder) {
        this.resetView();
        this.activeItem = {
            component: component,
            item: item
        };
    }

    public onItemsAdded(item: Folder | Document): void {
        this.setNewItems(<Folder>item);
        this.currentFolder = <Folder>item;
        this.headerCommunicationService.triggerAddItem.next(false);
    }

    public addItem() {
        this.resetView();
        if (this.currentFolder && this.currentFolder.isMainFolder) {
            this.activeItem = {
                component: 'cim-item-create',
                item: null
            };
        } else {
            this.activeItem = {
                component: 'cim-item-list',
                item: null,
                mainFolder: this.mainFolder
            };
        }
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



    private resetView(): void {
        this.activeItem = undefined;
        this.showReadMode = false;
        this.headerCommunicationService.showDocumentToPdfButton.next(false);
    }
}
