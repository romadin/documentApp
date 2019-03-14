import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Location } from '@angular/common';
import { MatDialog, MatSidenav } from '@angular/material';
import { filter } from 'rxjs/operators';

import { UserService } from '../../shared/packages/user-package/user.service';
import { User } from '../../shared/packages/user-package/user.model';
import { ProjectPopupComponent } from '../popups/project-popup/project-popup.component';
import { RouterService } from '../../shared/service/router.service';
import { HeaderWithFolderCommunicationService } from '../../shared/packages/communication/HeaderWithFolder.communication.service';
import { ActionCommunicationService } from '../../shared/packages/communication/action.communication.service';

export interface MenuAction {
    onClick: (item?) => void;
    iconName: string;
    name: string;
    show: boolean;
    needsAdmin: boolean;
    urlGroup?: UrlGroup[];
    urlNotShow?: string;
}

type UrlGroup = '/projecten' | '/gebruikers' | '/projecten/:id/folder/:id'| '/projecten/:id/actionList/:id';

@Component({
  selector: 'cim-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
    @Input() sideNavigation: MatSidenav;
    @Output() addUserClick: EventEmitter<boolean> = new EventEmitter<boolean>();
    public actions: MenuAction[] = [];
    public actionBack: MenuAction;
    public actionMenu: MenuAction;
    public menuActions: MenuAction[] = [];
    public currentUser: User;
    private backRoute: string;
    private routeHistory: NavigationEnd[] = [];

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
        private actionCommunicationService: ActionCommunicationService
    ) {
        this.defineActions();
    }

    ngOnInit() {
        // track if url changes
        this.router.events.pipe( filter(event => event instanceof NavigationEnd ) ).subscribe((navigation: NavigationEnd) => {
            this.routeHistory.push(navigation);
            this.determineActions(navigation);
            this.actionBack.show = navigation.url === '/login' ? false : (navigation.url !== '/projecten');
        });

        this.routerService.backRoute.subscribe((backRoute: string) => {
            this.backRoute = backRoute;
        });

        this.folderCommunicationService.showAddUserButton.subscribe((show: boolean) => {
            this.actions.find((action) => action.name === 'Gebruiker toevoegen').show = show && this.currentUser.isAdmin();
        });

        this.actionCommunicationService.showArchivedActionsButton.subscribe((show: boolean) => {
            const archiveAction = this.actions.find((action) => action.name === 'Gearchiveerde acties');
            archiveAction.show = show;
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
            onClick: () => { this.addUserClick.emit(true); },
            iconName: 'person_add',
            name: 'Gebruiker toevoegen',
            show: false,
            needsAdmin: true,
            urlGroup: ['/gebruikers', '/projecten/:id/folder/:id'],
        };
        const addItemToFolder: MenuAction = {
            onClick: () => { this.folderCommunicationService.triggerAddItem.next(true); },
            iconName: 'add',
            name: 'Hoofdstuk toevoegen',
            show: false,
            needsAdmin: true,
            urlGroup: ['/projecten/:id/folder/:id'],
        };
        const readMode: MenuAction = {
            onClick: () => { this.folderCommunicationService.triggerReadMode.next(true); },
            iconName: 'book',
            name: 'Boek modus',
            show: false,
            needsAdmin: false,
            urlGroup: ['/projecten/:id/folder/:id'],
        };
        const addAction: MenuAction = {
            onClick: () => { this.actionCommunicationService.triggerAddAction.next(true); },
            iconName: 'add',
            name: 'Actie toevoegen',
            show: false,
            needsAdmin: true,
            urlGroup: ['/projecten/:id/actionList/:id'],
        };
        const showArchivedActions: MenuAction = {
            onClick: () => { this.actionCommunicationService.showArchivedActions.next(true); },
            iconName: 'archive',
            name: 'Gearchiveerde acties',
            show: false,
            needsAdmin: true,
            urlGroup: ['/projecten/:id/actionList/:id'],
        };
        this.actionMenu = {
            onClick: () => { this.sideNavigation.toggle(); },
            iconName: 'menu',
            name: 'menu',
            show: false,
            needsAdmin: false,
        };
        this.actions.push(addProject, addUser, readMode, addItemToFolder, showArchivedActions, addAction);
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
        this.dialog.open(ProjectPopupComponent, {
            width: '400px',
            data: {
                title: 'Voeg een project toe',
                placeholder: 'Project naam',
                submitButton: 'Voeg toe',
            }
        });
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
