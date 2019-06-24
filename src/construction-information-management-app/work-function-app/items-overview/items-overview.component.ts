import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Folder } from '../../../shared/packages/folder-package/folder.model';
import { Document} from '../../../shared/packages/document-package/document.model';
import { User } from '../../../shared/packages/user-package/user.model';
import { WorkFunction } from '../../../shared/packages/work-function-package/work-function.model';
import { FolderCommunicationService } from '../../../shared/service/communication/Folder.communication.service';
import { HeaderWithFolderCommunicationService } from '../../../shared/service/communication/HeaderWithFolder.communication.service';
import { ActiveItemPackage } from '../folder-detail/folder-detail.component';

@Component({
  selector: 'cim-items-overview',
  templateUrl: './items-overview.component.html',
  styleUrls: ['./items-overview.component.css']
})
export class ItemsOverviewComponent implements OnInit, OnDestroy  {
    @Input() currentUser: User;
    @Input() items: ( Document | Folder)[];
    @Input() workFunction: WorkFunction;
    @Input() mainFunction: WorkFunction;
    activeItem: ActiveItemPackage;
    showReadMode: boolean;
    showReadModeAnimation: boolean;

    private subscriptions: Subscription[] = [];

    constructor(
        private headerCommunicationService: HeaderWithFolderCommunicationService,
        private folderCommunicationService: FolderCommunicationService,
    ) { }

    ngOnInit() {
        this.resetView();
        this.subscriptions.push(this.headerCommunicationService.triggerReadMode.subscribe((read: boolean) => {
            if (read && !this.showReadMode) {
                this.resetView();
                this.showReadMode = this.showReadModeAnimation = read;
            }
        }));
        this.subscriptions.push(this.headerCommunicationService.triggerAddItem.subscribe((trigger: boolean) => {
            if (trigger) {
                this.addItem();
            }
        }));
        this.subscriptions.push(this.folderCommunicationService.onItemCloseListener.subscribe((onClose: boolean) => {
            if (onClose) {
                this.resetView();
            }
        }));
        this.headerCommunicationService.showReadModeButton.next(true);
        this.headerCommunicationService.showAddUserButton.next(false);
    }

    ngOnDestroy() {
        this.headerCommunicationService.triggerAddItem.next(false);
        this.headerCommunicationService.triggerReadMode.next(false);
        this.subscriptions.map(s => s.unsubscribe());
    }

    onItemView(component: string, item?: Document | Folder) {
        this.resetView();
        this.activeItem = {
            component: component,
            item: item
        };
    }
    onCloseReadMode(close: boolean) {
        this.showReadModeAnimation = !close;
        setTimeout(() => {
            this.resetView();
        }, 900);
    }
    onCloseRightSide(close: boolean): void {
        this.resetView();
    }
    checkItemIsFolder(item): boolean {
        return item instanceof Folder;
    }
    onItemsAdded(item: WorkFunction | Document): void {
        this.headerCommunicationService.triggerAddItem.next(false);
    }
    private addItem() {
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
    private resetView(): void {
        this.activeItem = undefined;
        this.showReadMode = false;
        this.headerCommunicationService.showDocumentToPdfButton.next(false);
    }
}
