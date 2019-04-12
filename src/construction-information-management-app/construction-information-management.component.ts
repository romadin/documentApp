import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDrawerContent } from '@angular/material';
import { NavigationEnd, Router } from '@angular/router';
import { delay, filter } from 'rxjs/operators';

import { User } from '../shared/packages/user-package/user.model';
import { UserService } from '../shared/packages/user-package/user.service';
import { ScrollingService } from '../shared/service/scrolling.service';
import { MenuAction } from './header/header.component';

import { LoadingService } from '../shared/loading.service';

@Component({
    selector: 'cim-root',
    templateUrl: './construction-information-management.component.html',
    styleUrls: [ './construction-information-management.component.css']
})
export class ConstructionInformationManagementComponent implements OnInit, AfterViewInit {
    @ViewChild('sideMenuContent') sideMenuElement: MatDrawerContent;
    public sideMenuActions: MenuAction[] = [];
    public currentUser: User;
    public resetHeaderAction = false;
    public showIsLoading = false;

    constructor(private dialog: MatDialog,
                private router: Router,
                private userService: UserService,
                private scrollingService: ScrollingService,
                private loadingService: LoadingService) {}

    ngOnInit() {
        this.router.events.pipe( filter(event => event instanceof NavigationEnd ) ).subscribe((navigation: NavigationEnd) => {
            this.determineActions(navigation);
        });
        this.defineSideMenuActions();

        this.loadingService.isLoading.pipe(delay(0)).subscribe((isLoading: boolean) => {
            this.showIsLoading = isLoading;
        });
    }

    ngAfterViewInit() {
        this.sideMenuElement.elementScrolled().subscribe((event) => {
            this.scrollingService.setScrollPosition(this.sideMenuElement.measureScrollOffset('top'));
        });
    }

    private determineActions(navigation: NavigationEnd): void {
        if ( navigation.url !== '/login' ) {
            this.userService.getCurrentUser().subscribe((user: User) => {
                this.currentUser = user;
                if ( user && user.role ) {
                    this.sideMenuActions.forEach(( action: MenuAction ) => {
                        // step 1 check if action only needs to show at an specific url.
                        if (action.urlGroup) {
                            action.urlGroup.forEach((urlGroup) => {
                                action.show = urlGroup === navigation.url;
                            });
                        }
                        // step 2 check if action does not need to be shown at specific url.
                        action.show = action.urlNotShow ? action.urlNotShow !== navigation.url : true;
                        // step 3 check if action needs admin and if users has rights.
                        action.show = action.needsAdmin ? user.role.getName() === 'admin' : true;
                    });
                }
            });
        }
    }

    private defineSideMenuActions(): void {
        const projects: MenuAction = {
            onClick: () => {
                this.router.navigate(['projecten']);
            },
            iconName: 'library_books',
            name: 'Projecten',
            show: true,
            needsAdmin: false,
            urlNotShow: '/projecten'
        };
        const showUsers: MenuAction = {
            onClick: () => {
                this.router.navigate(['gebruikers']);
            },
            iconName: 'group',
            name: 'Gebruikers',
            show: true,
            needsAdmin: true,
        };
        const logout: MenuAction = {
            onClick: this.logoutCurrentUser.bind(this),
            iconName: 'exit_to_app',
            name: 'Uitloggen',
            show: true,
            needsAdmin: false,
        };

        this.sideMenuActions.push(projects, showUsers, logout);
    }

    private logoutCurrentUser(): void {
        sessionStorage.clear();
        this.resetHeaderAction = true;
        this.clearAllActions();
        this.router.navigate(['login']);
    }

    private clearAllActions(): void {
        this.sideMenuActions.forEach((action: MenuAction) => {
            action.show = false;
        });
    }

}
