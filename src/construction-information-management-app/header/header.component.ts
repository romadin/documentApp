import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Location } from '@angular/common';
import { MatDialog, MatSidenav } from '@angular/material';
import { filter, takeLast } from 'rxjs/operators';

import { UserService } from '../../shared/packages/user-package/user.service';
import { User } from '../../shared/packages/user-package/user.model';
import { ProjectCommunicationService } from '../../shared/service/communication/project.communication.service';
import { ProjectPopupComponent, DefaultPopupData } from '../popups/project-popup/project-popup.component';
import { RouterService } from '../../shared/service/router.service';
import { HeaderWithFolderCommunicationService } from '../../shared/service/communication/HeaderWithFolder.communication.service';
import { ActionCommunicationService } from '../../shared/service/communication/action.communication.service';
import { UserPopupComponent } from '../popups/user-popup/user-popup.component';
import { OrganisationService } from '../../shared/packages/organisation-package/organisation.service';
import { Organisation } from '../../shared/packages/organisation-package/organisation.model';
import { EventCommunicationService } from '../../shared/service/communication/event.communication.service';
import { UsersCommunicationService } from '../../shared/service/communication/users-communication.service';
import { TemplateCommunicationService } from '../../shared/service/communication/template.communication.service';

export interface MenuAction {
    onClick: (item?) => void;
    iconName: string;
    name: string;
    show: boolean;
    needsAdmin: boolean;
    urlGroup?: UrlGroup[];
    urlNotShow?: string;
}

type UrlGroup = '/projecten' | '/projecten/:id' | '/gebruikers' | '/projecten/:id/functies/:id'|
    '/projecten/:id/acties'| '/projecten/:id/agenda' | '/templates';

@Component({
  selector: 'cim-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
    @Input() sideNavigation: MatSidenav;
    public actions: MenuAction[] = [];
    public actionBack: MenuAction;
    public actionMenu: MenuAction;
    public currentUser: User;
    private backRoute: string;
    private routeHistory: NavigationEnd[] = [];
    private currentOrganisation: Organisation;

    @Input()
    set OnResetActions(reset: boolean) {
        if (reset) {
            this.actions.forEach((action) => {
                action.show = false;
            });
        }
    }

    constructor(
        public dialog: MatDialog,
        private location: Location,
        private router: Router,
        private userService: UserService,
        private routerService: RouterService,
        private folderCommunicationService: HeaderWithFolderCommunicationService,
        private actionCommunicationService: ActionCommunicationService,
        private eventCommunicationService: EventCommunicationService,
        private usersCommunicationService: UsersCommunicationService,
        private templateCommunicationService: TemplateCommunicationService,
        private projectCommunicationService: ProjectCommunicationService,
        private organisationService: OrganisationService,
    ) {
        this.defineActions();
    }

    ngOnInit() {
        let waitUntilRouteSubscription = false;
        // track if url changes
        this.router.events.pipe( filter(event => event instanceof NavigationEnd ) ).subscribe((navigation: NavigationEnd) => {
            this.routeHistory.push(navigation);
            this.determineActions(navigation);
            this.actionBack.show = navigation.url === '/login' || navigation.url === '/not-found/organisation' ?
                false : navigation.url !== '/projecten';
            waitUntilRouteSubscription = true;
        });

        this.routerService.backRoute.subscribe((backRoute: string) => {
            this.backRoute = backRoute;
        });

        this.folderCommunicationService.showAddUserButton.subscribe((show: boolean) => {
            this.actions.find((action) => action.name === 'Gebruiker toevoegen').show = show && this.currentUser.isAdmin();
        });

        this.folderCommunicationService.showDocumentToPdfButton.subscribe((show: boolean) => {
            this.actions.find((action) => action.name === 'Exporteer naar pdf').show = show;
        });
        this.folderCommunicationService.showReadModeButton.subscribe(show => {
            this.actions.find((action) => action.name === 'Boek modus').show = show;
        });
        this.folderCommunicationService.showAddItemButton.subscribe(show => {
            this.actions.find((action) => action.name === 'Hoofdstuk toevoegen').show = show;
        });

        this.actionCommunicationService.showArchivedActionsButton.subscribe((show: boolean) => {
            const archiveAction = this.actions.find((action) => action.name === 'Gearchiveerde acties');
            archiveAction.show = show;
        });

        this.usersCommunicationService.triggerAddUserPopup.subscribe(addUser => {
            if (addUser) {
                this.openDialogAddUser();
            }
        });

        this.organisationService.getCurrentOrganisation().pipe((takeLast(1))).subscribe((currentOrganisation) => {
            this.currentOrganisation = currentOrganisation;
        });
    }

    private defineActions(): void {
        this.actionBack = {
            onClick: this.onBackRouting.bind(this),
            iconName: 'arrow_back_ios',
            name: 'back',
            show: false,
            needsAdmin: false,
        };
        const addProject: MenuAction = {
            onClick: this.openDialogAddProject.bind(this),
            iconName: 'add',
            name: 'Project toevoegen',
            show: false,
            needsAdmin: true,
            urlGroup: ['/projecten'],
        };
        const addUser: MenuAction = {
            onClick: this.openDialogAddUser.bind(this),
            iconName: 'person_add',
            name: 'Gebruiker toevoegen',
            show: false,
            needsAdmin: true,
            urlGroup: ['/gebruikers', '/projecten/:id/functies/:id'],
        };
        const addItemToFolder: MenuAction = {
            onClick: () => { this.folderCommunicationService.triggerAddItem.next(true); },
            iconName: 'add',
            name: 'Hoofdstuk toevoegen',
            show: false,
            needsAdmin: true,
            urlGroup: ['/projecten/:id/functies/:id'],
        };
        const readMode: MenuAction = {
            onClick: () => { this.folderCommunicationService.triggerReadMode.next(true); },
            iconName: 'book',
            name: 'Boek modus',
            show: false,
            needsAdmin: false,
            urlGroup: ['/projecten/:id/functies/:id'],
        };
        const documentToPdf: MenuAction = {
            onClick: () => { this.folderCommunicationService.exportToPdf.next(true); },
            iconName: 'picture_as_pdf',
            name: 'Exporteer naar pdf',
            show: false,
            needsAdmin: false,
            urlGroup: ['/projecten/:id/functies/:id'],
        };
        const addAction: MenuAction = {
            onClick: () => { this.actionCommunicationService.triggerAddAction.next(true); },
            iconName: 'add',
            name: 'Actie toevoegen',
            show: false,
            needsAdmin: true,
            urlGroup: ['/projecten/:id/acties'],
        };
        const showArchivedActions: MenuAction = {
            onClick: () => { this.actionCommunicationService.showArchivedActions.next(true); },
            iconName: 'archive',
            name: 'Gearchiveerde acties',
            show: false,
            needsAdmin: true,
            urlGroup: ['/projecten/:id/acties'],
        };
        const actionsToPdf: MenuAction = {
            onClick: () => { this.actionCommunicationService.exportToPdf.next(true); },
            iconName: 'picture_as_pdf',
            name: 'Exporteer naar pdf',
            show: false,
            needsAdmin: false,
            urlGroup: ['/projecten/:id/acties'],
        };
        const addEvent: MenuAction = {
            onClick: () => { this.eventCommunicationService.triggerAddEvent.next(true); },
            iconName: 'add',
            name: 'Activiteit toevoegen',
            show: false,
            needsAdmin: true,
            urlGroup: ['/projecten/:id/agenda'],
        };
        const addTemplate: MenuAction = {
            onClick: () => { this.templateCommunicationService.triggerAddTemplate.next(true); },
            iconName: 'add',
            name: 'Template toevoegen',
            show: false,
            needsAdmin: true,
            urlGroup: ['/templates'],
        };
        const addWorkFunction: MenuAction = {
            onClick: () => { this.projectCommunicationService.triggerAddWorkFunction.next(true); },
            iconName: 'add',
            name: 'Functie toevoegen',
            show: false,
            needsAdmin: true,
            urlGroup: ['/projecten/:id'],
        };
        this.actionMenu = {
            onClick: () => { this.sideNavigation.toggle(); },
            iconName: 'menu',
            name: 'menu',
            show: false,
            needsAdmin: false,
        };
        this.actions.push(
            addProject, addUser,
            documentToPdf, readMode, addItemToFolder,
            actionsToPdf, showArchivedActions, addAction,
            addEvent, addTemplate, addWorkFunction
        );
    }

    private determineActions(navigation: NavigationEnd): void {
        this.actionMenu.show = navigation.url !== '/login';
        if ( navigation.url !== '/login' ) {
            this.userService.getCurrentUser().subscribe((user: User) => {
                this.currentUser = user;
                if ( user ) {
                    this.actions.forEach(( action: MenuAction ) => {
                        if ( !action.urlGroup && action.needsAdmin ) {
                            action.show = user.isAdmin();
                        } else if ( action.urlGroup ) {
                            for ( const urlGroup of action.urlGroup ) {
                                if (urlGroup === navigation.url) {
                                    action.show = action.needsAdmin ? this.currentUser.isAdmin() : true;
                                    return;
                                }
                                const needToChangeUrlGroup = urlGroup.match(/(:id)/g);
                                if (needToChangeUrlGroup) {
                                    const tempUrlGroup = this.replaceIdForUrlGroup(navigation.url, urlGroup);
                                    action.show = tempUrlGroup === navigation.url;
                                    if (action.needsAdmin && tempUrlGroup === navigation.url) {
                                        action.show = user.isAdmin();
                                        return;
                                    }
                                } else {
                                    action.show = urlGroup === navigation.url;
                                }
                            }
                        }
                    });
                }
            });
        }
    }

    /**
     * Get the url to route back. If we have none then we route back to the projects-list.
     */
    private onBackRouting(): void {
        if (this.backRoute) {
            this.router.navigate([this.backRoute]);
        } else if (this.routeHistory.length > 1) {
            this.location.back();
        } else {
            this.router.navigate(['/projecten']);
        }
        this.folderCommunicationService.triggerReadMode.next(false);
    }

    private openDialogAddProject(): void {
        const data: DefaultPopupData =  {
            title: 'Voeg een projectId toe',
            placeholder: 'Project naam',
            submitButton: 'Voeg toe',
            organisation: this.currentOrganisation
        };
        this.dialog.open(ProjectPopupComponent, {
            width: '400px',
            data: data,
        });
    }

    private openDialogAddUser(): void {
        if (this.router.url === '/gebruikers') {
            this.usersCommunicationService.addUserInUserComponent.next(true);
            return;
        }
        const data: DefaultPopupData = {
            title: 'Voeg een gebruiker toe',
                placeholder: 'Project naam',
                submitButton: 'Voeg toe',
                organisation: this.currentOrganisation
        };
        const dialogRef = this.dialog.open(UserPopupComponent, {
            width: '600px',
            data: data,
        });
        dialogRef.afterClosed().subscribe();
    }

    private replaceIdForUrlGroup(currentUrl: string, urlGroup: UrlGroup): UrlGroup {
        const groupArray = urlGroup.split('/');
        const indexArray: number[] = [];
        groupArray.forEach((id, index) => {
            if (id === ':id') {
                indexArray.push(index);
            }
        });

        const currentUrlArray = currentUrl.split('/');

        indexArray.forEach((index) => {
            if ( currentUrlArray[index] ) {
                groupArray.splice(index, 1, currentUrlArray[index]);
            }
        });
        return <UrlGroup>groupArray.join('/');
    }
}
