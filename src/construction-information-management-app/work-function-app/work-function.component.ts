import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { ProjectService } from '../../shared/packages/project-package/project.service';

import { WorkFunction } from '../../shared/packages/work-function-package/work-function.model';
import { WorkFunctionService } from '../../shared/packages/work-function-package/work-function.service';
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

@Component({
  selector: 'cim-work-function',
  templateUrl: './work-function.component.html',
  styleUrls: ['./work-function.component.css']
})
export class WorkFunctionComponent implements OnInit, OnDestroy {
    documents: Document[];
    workFunction: WorkFunction;
    mainFunction: WorkFunction;
    currentUser: User;
    items: (Document | Folder)[];
    showReadMode: boolean;
    showReadModeAnimation: boolean;
    activeItem: ActiveItemPackage;

    private subscriptions: Subscription[] = [];

    constructor(private folderService: FolderService,
                private documentService: DocumentService,
                private userService: UserService,
                private projectService: ProjectService,
                private workFunctionService: WorkFunctionService,
                private activatedRoute: ActivatedRoute,
                private routerService: RouterService,
                private headerCommunicationService: HeaderWithFolderCommunicationService,
                private folderCommunicationService: FolderCommunicationService,
    ) { }

    ngOnInit() {
        this.resetView();
        const workFunctionId: number = parseInt(this.activatedRoute.snapshot.paramMap.get('id'), 10);
        const projectId: number = parseInt(location.pathname.split('/')[2], 10);
        this.projectService.getProject(projectId, this.activatedRoute.snapshot.data.organisation).subscribe(project => {
            this.workFunction = project.workFunctions.find(w => w.id === workFunctionId);

            this.workFunction.items.subscribe(items => this.items = items );
            this.mainFunction = project.workFunctions.find(w => w.isMainFunction);
        });

        this.routerService.setBackRouteParentFromActivatedRoute(this.activatedRoute.parent);

        this.subscriptions.push(this.userService.getCurrentUser().subscribe((user: User) => {
            this.currentUser = user;
        }));

        this.subscriptions.push(this.headerCommunicationService.triggerAddItem.subscribe((trigger: boolean) => {
            if (trigger) {
                this.addItem();
            }
        }));

        this.subscriptions.push(this.headerCommunicationService.triggerReadMode.subscribe((read: boolean) => {
            if (read && !this.showReadMode) {
                this.resetView();
                this.showReadMode = this.showReadModeAnimation = read;
            }
        }));

        this.subscriptions.push(this.folderCommunicationService.onItemCloseListener.subscribe((onClose: boolean) => {
            if (onClose) {
                this.resetView();
            }
        }));

        this.headerCommunicationService.showAddUserButton.next(false);
    }

    ngOnDestroy() {
        this.headerCommunicationService.triggerAddItem.next(false);
        this.headerCommunicationService.triggerReadMode.next(false);
        this.subscriptions.map(s => s.unsubscribe());
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

    public onItemsAdded(item: WorkFunction | Document): void {
        // this.setNewItems(<Folder>item);
        this.headerCommunicationService.triggerAddItem.next(false);
    }

    public addItem() {
        this.resetView();
        if (this.workFunction.isMainFunction) {
            this.activeItem = {
                component: 'cim-item-create',
                item: null
            };
        } else {
            this.activeItem = {
                component: 'cim-item-list',
                item: null,
                mainFunction: this.mainFunction
            };
        }
    }

    public checkItemIsFolder(item): boolean {
        return item instanceof Folder;
    }



    private resetView(): void {
        this.activeItem = undefined;
        this.showReadMode = false;
        this.headerCommunicationService.showDocumentToPdfButton.next(false);
    }
}
