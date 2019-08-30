import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Company } from '../../../shared/packages/company-package/company.model';
import { Document} from '../../../shared/packages/document-package/document.model';
import { User } from '../../../shared/packages/user-package/user.model';
import { isWorkFunction } from '../../../shared/packages/work-function-package/interface/work-function.interface';
import { WorkFunction } from '../../../shared/packages/work-function-package/work-function.model';
import { FolderCommunicationService } from '../../../shared/service/communication/Folder.communication.service';
import { HeaderWithFolderCommunicationService } from '../../../shared/service/communication/HeaderWithFolder.communication.service';
import { RouterService } from '../../../shared/service/router.service';
import { ToItemsOverview } from '../document-row/document-row.component';
import { ActiveItemPackage } from '../folder-detail/folder-detail.component';
import { ChildItemPackage } from '../work-function-package-resolver.service';

@Component({
  selector: 'cim-items-overview',
  templateUrl: './items-overview.component.html',
  styleUrls: ['./items-overview.component.css']
})
export class ItemsOverviewComponent implements OnInit, OnDestroy  {
    currentUser: User;
    parent: WorkFunction | Company;
    mainFunction: WorkFunction;
    items: Document[];
    activeItem: ActiveItemPackage;
    showReadMode: boolean;
    showReadModeAnimation: boolean;
    errorMessage = 'deze functie';

    private subscriptions: Subscription[] = [];

    constructor(
        private headerCommunicationService: HeaderWithFolderCommunicationService,
        private folderCommunicationService: FolderCommunicationService,
        private routerService: RouterService,
        private activatedRoute: ActivatedRoute,
    ) { }

    ngOnInit() {
        this.setInitialValues();
        this.errorMessage = isWorkFunction(parent) ? 'deze functie' : 'dit bedrijf';
        this.parent.documents.subscribe(items => this.items = items );

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

        this.headerCommunicationService.showAddUserButton.next(false);
    }

    ngOnDestroy() {
        this.headerCommunicationService.triggerAddItem.next(false);
        this.headerCommunicationService.triggerReadMode.next(false);
        this.subscriptions.map(s => s.unsubscribe());
    }

    onItemView(component: string, itemsOverviewPackage?: ToItemsOverview) {
        this.resetView();
        this.activeItem = {
            component: component,
            item: itemsOverviewPackage.document,
            parent: itemsOverviewPackage.document
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

    onItemsAdded(item: WorkFunction | Document): void {
        this.headerCommunicationService.triggerAddItem.next(false);
    }

    addItem(parent: WorkFunction | Document | null = null) {
        this.resetView();
        if (isWorkFunction(this.parent) && this.parent.isMainFunction) {
            this.activeItem = {
                component: 'cim-item-create',
                item: null,
                parent: parent
            };
        } else {
            this.activeItem = {
                component: 'cim-item-list',
                item: null,
                mainFunction: this.mainFunction,
                parent: parent
            };
        }
    }

    private setInitialValues(): void {
        const functionPackage: ChildItemPackage = this.activatedRoute.snapshot.data.functionPackage;
        this.parent = functionPackage.parent;
        this.currentUser = functionPackage.currentUser;
        this.mainFunction = functionPackage.mainFunction;

        if (this.activatedRoute.snapshot.data.parentUrl) {
            const url = <string>(this.activatedRoute.snapshot.data.parentUrl).replace(':id', this.mainFunction.parent.id);
            this.routerService.setBackRoute(url);
        } else {
            this.routerService.setBackRouteParentFromActivatedRoute(this.activatedRoute);
        }
    }

    private resetView(): void {
        this.activeItem = undefined;
        this.showReadMode = false;
        this.headerCommunicationService.showDocumentToPdfButton.next(false);
    }
}
