import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Location } from '@angular/common';
import { MatDialog, MatSidenav } from '@angular/material';
import { filter } from 'rxjs/operators';

import { UserService } from '../../shared/packages/user-package/user.service';
import { User } from '../../shared/packages/user-package/user.model';
import { ProjectPopupComponent } from '../popups/project-popup/project-popup.component';
import { UserPopupComponent } from '../popups/user-popup/user-popup.component';
import { RouterService } from '../../shared/service/router.service';

export interface MenuAction {
    onClick: (item?) => void;
    iconName: string;
    name: string;
    show: boolean;
    needsAdmin: boolean;
    location?: Location;
    urlGroup?: UrlGroup;
}

type UrlGroup = '/overview';

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
    public menuActions: MenuAction[] = [];
    public currentUser: User;
    private backRoute: string;
    private routeHistory: NavigationEnd[] = [];

    constructor(
        public dialog: MatDialog,
        private location: Location,
        private router: Router,
        private userService: UserService,
        private routerService: RouterService,
    ) {
        this.defineActions();
    }

    ngOnInit() {
        // track if url changes
        this.router.events.pipe( filter(event => event instanceof NavigationEnd ) ).subscribe((navigation: NavigationEnd) => {
            this.routeHistory.push(navigation);
            this.determineActions(navigation);
            this.actionBack.show = navigation.url !== '/login';
        });

        this.routerService.backRoute.subscribe((backRoute: string) => {
            this.backRoute = backRoute;
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
            urlGroup: '/overview',
        };
        this.actionMenu = {
            onClick: () => { this.sideNavigation.toggle(); },
            iconName: 'menu',
            name: 'menu',
            show: false,
            needsAdmin: true,
        };
        this.actions.push(addProject);
    }

    private determineActions(navigation: NavigationEnd): void {
        this.actionMenu.show = navigation.url !== '/login';
        if ( navigation.url !== '/login' ) {
            this.userService.getCurrentUser().subscribe((user: User) => {
                this.currentUser = user;
                if ( user && user.role ) {
                    this.actions.forEach(( action: MenuAction ) => {
                        if ( !action.urlGroup && action.needsAdmin || action.urlGroup === navigation.url && action.needsAdmin ) {
                            action.show = user.role.getName() === 'admin';
                        } else {
                            action.show = action.urlGroup === navigation.url;
                        }
                    });
                }
            });
        }
    }

    /**
     * Get the url to route back. If we have none then we route back to the overview.
     */
    private onBackRouting(): void {
        if (this.backRoute) {
            this.router.navigate([this.backRoute]);
        } else if (this.routeHistory.length > 1) {
            this.location.back();
        } else {
            this.router.navigate(['/overview']);
        }
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
}
