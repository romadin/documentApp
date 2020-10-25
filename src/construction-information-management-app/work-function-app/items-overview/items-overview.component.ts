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
import { UserService } from '../../../shared/packages/user-package/user.service';
import { Project } from '../../../shared/packages/project-package/project.model';
import { MenuAction } from '../../header/header.component';
import { getDataFromRoute } from '../../../shared/helpers/global-functions';

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
        private userService: UserService,
        private routerService: RouterService,
        private activatedRoute: ActivatedRoute,
    ) { }

    ngOnInit() {
        this.routerService.setHeaderAction(this.getHeaderActions());
        this.subscriptions.push(this.userService.getCurrentUser().subscribe(user => this.currentUser = user));

        this.parent = getDataFromRoute('parent', this.activatedRoute.snapshot) as WorkFunction | Company;
        const project: Project = isWorkFunction(this.parent) ? this.parent.parent as Project : this.parent.parent.parent as Project;

        project.workFunctions.subscribe((workFunctions) => {
            this.mainFunction = workFunctions.find(w => w.isMainFunction);
        });

        // setting the documents.
        this.subscriptions.push(this.parent.documents.subscribe((items: Document[]) => {
            this.items = items;
        }));

        this.resetView();
        this.setInitialValues();
        this.errorMessage = isWorkFunction(this.parent) ? 'deze functie' : 'dit bedrijf';
    }

    ngOnDestroy() {
        this.subscriptions.map(s => s.unsubscribe());
    }

    onItemView(component: string, itemsOverviewPackage?: ToItemsOverview) {
        this.resetView();
        this.activeItem = {
            component: component,
            item: itemsOverviewPackage ? itemsOverviewPackage.document : null,
            parent: itemsOverviewPackage ? itemsOverviewPackage.parent : null
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

    private getHeaderActions(): MenuAction[] {
        const addItemToFolder: MenuAction = {
            onClick: this.addItem.bind(this),
            iconName: 'add',
            name: 'Hoofdstuk toevoegen',
            show: false,
            needsAdmin: true,
        };

        const readMode: MenuAction = {
            onClick: () => { this.resetView(); this.showReadMode = this.showReadModeAnimation = true; },
            iconName: 'book',
            name: 'Boek modus',
            show: true,
            needsAdmin: false,
        };
        return [addItemToFolder, readMode];
    }

    private setInitialValues(): void {
        if (this.activatedRoute.snapshot.data.parentUrl) {
            const url = <string>(this.activatedRoute.snapshot.data.parentUrl).replace(':id', this.parent.parent.id.toString(10));
            this.routerService.setBackRoute(url);
        } else {
            this.routerService.setBackRouteParentFromActivatedRoute(this.activatedRoute);
        }
    }

    private resetView(): void {
        this.activeItem = undefined;
        this.showReadMode = false;
        this.routerService.setHeaderAction(this.getHeaderActions());
    }
}
