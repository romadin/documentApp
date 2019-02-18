import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Location } from '@angular/common';
import { MatDialog } from '@angular/material';
import { filter } from 'rxjs/operators';

import { UserService } from '../../shared/packages/user-package/user.service';
import { User } from '../../shared/packages/user-package/user.model';
import { ProjectPopupComponent } from '../popups/project-popup/project-popup.component';
import { UserPopupComponent } from '../popups/user-popup/user-popup.component';

interface HeaderAction {
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
    public actions: HeaderAction[] = [];
    public actionBack: HeaderAction;
    public menuActions: HeaderAction[] = [];
    public routHistory: NavigationEnd[] = [];
    public currentUser: User;

    constructor(
        public dialog: MatDialog,
        private location: Location,
        private router: Router,
        private userService: UserService
    ) {
        this.defineActions();
    }

    ngOnInit() {
        // track if url changes
        this.router.events.pipe( filter(event => event instanceof NavigationEnd ) ).subscribe((navigation: NavigationEnd) => {
            this.routHistory.push(navigation);
            this.determineBackAction(this.routHistory);
            this.determineActions(navigation);
        });
        this.defineMenuActions();
    }

    private defineActions(): void {
        const location = this.location;
        this.actionBack = {
            onClick: () => {
                location.back();
            },
            iconName: 'arrow_back_ios',
            name: 'back',
            show: false,
            needsAdmin: false,
        };
        const addProject: HeaderAction = {
            onClick: this.openDialogAddProject.bind(this),
            iconName: 'add',
            name: 'Project toevoegen',
            show: false,
            needsAdmin: true,
            urlGroup: '/overview',
        };
        const menu = {
            onClick: () => { },
            iconName: 'menu',
            name: 'menu',
            show: false,
            needsAdmin: true,
        };
        this.actions.push(addProject, menu);
    }

    private defineMenuActions(): void {
        const addUser: HeaderAction = {
            onClick: this.openDialogAddUser.bind(this),
            iconName: 'person_add',
            name: 'Gebruiker toevoegen',
            show: true,
            needsAdmin: true,
        };
        const showUsers: HeaderAction = {
            onClick: () => {
                this.router.navigate(['gebruikers']);
            },
            iconName: 'group',
            name: 'Gebruikers',
            show: true,
            needsAdmin: true,
        };
        const logout: HeaderAction = {
            onClick: this.logoutCurrentUser.bind(this),
            iconName: 'exit_to_app',
            name: 'Uitloggen',
            show: true,
            needsAdmin: false,
        };

        this.menuActions.push(addUser, showUsers, logout);
    }

    private determineActions(navigation: NavigationEnd): void {
        if ( navigation.url !== '/login' ) {
            this.userService.getCurrentUser().subscribe((user: User) => {
                this.currentUser = user;
                if ( user && user.role ) {
                    this.actions.forEach(( action: HeaderAction ) => {
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

    private determineBackAction(routHistory: NavigationEnd[]) {
        if ( routHistory.length > 1 ) {
            this.actionBack.show = true;
        }
        // login page
        if ( this.routHistory[0].url === this.routHistory[this.routHistory.length - 1].url ) {
            this.actionBack.show = false;
        }
    }

    private openDialogAddProject(): void {
        const dialogRef = this.dialog.open(ProjectPopupComponent, {
            width: '400px',
            data: {
                title: 'Voeg een project toe',
                placeholder: 'Project naam',
                submitButton: 'Voeg toe',
            }
        });
        dialogRef.afterClosed().subscribe(result => {
        });
    }

    private openDialogAddUser(): void {
        const dialogRef = this.dialog.open(UserPopupComponent, {
            width: '600px',
            data: {
                title: 'Voeg een gebruiker toe',
                placeholder: 'Project naam',
                submitButton: 'Voeg toe',
            }
        });
        dialogRef.afterClosed().subscribe(result => {
        });
    }

    private logoutCurrentUser(): void {
        localStorage.clear();
        this.router.navigate(['login']);
    }


}
