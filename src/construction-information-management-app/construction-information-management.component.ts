import { AfterViewChecked, AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDrawerContent } from '@angular/material';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { delay, filter, takeLast } from 'rxjs/operators';
import { Module } from '../shared/packages/module-package/module.model';
import { Organisation } from '../shared/packages/organisation-package/organisation.model';
import { OrganisationService } from '../shared/packages/organisation-package/organisation.service';

import { User } from '../shared/packages/user-package/user.model';
import { UserService } from '../shared/packages/user-package/user.service';
import { ScrollingService } from '../shared/service/scrolling.service';
import { MenuAction } from './header/header.component';

import { LoadingService } from '../shared/loading.service';

export type ModuleName = 'Templates' | 'Assign chapter company' | 'Branding' | 'Basic ILS';

export interface SideMenuNav extends MenuAction {
    moduleName?: ModuleName;
}
@Component({
    selector: 'cim-root',
    templateUrl: './construction-information-management.component.html',
    styleUrls: [ './construction-information-management.component.css']
})
export class ConstructionInformationManagementComponent implements OnInit, AfterViewChecked {
    @ViewChild('sideMenuContent') sideMenuElement: MatDrawerContent;
    sideMenuActions: MenuAction[] = [];
    currentUser: User;
    resetHeaderAction = false;
    showIsLoading = false;
    organisation: Organisation;

    constructor(private dialog: MatDialog,
                private router: Router,
                private userService: UserService,
                private scrollingService: ScrollingService,
                private loadingService: LoadingService,
                private organisationService: OrganisationService,
                private activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.defineSideMenuActions();
        this.organisationService.getOrganisation().subscribe(organisation => {
            this.organisation = organisation;

            if (organisation) {
                document.documentElement.style.setProperty('--primary-color', organisation.primaryColor);
                document.documentElement.style.setProperty('--secondary-color', organisation.secondaryColor);
                // this.determineActions();
            }
            document.documentElement.style.setProperty(
                '--secondary-hover-color',
                this.getHoverColor(getComputedStyle(document.documentElement).getPropertyValue('--secondary-color'))
            );

            this.loadingService.isLoading.pipe(delay(0)).subscribe((isLoading: boolean) => {
                this.showIsLoading = isLoading;
            });
        });
        this.router.events.pipe( filter(event => event instanceof NavigationEnd ) ).subscribe((navigation: NavigationEnd) => {
            this.determineActions(navigation.url);
        });
    }

    ngAfterViewChecked() {
        if (this.sideMenuElement) {
            this.sideMenuElement.elementScrolled().subscribe((event) => {
                this.scrollingService.setScrollPosition(this.sideMenuElement.measureScrollOffset('top'));
            });
        }
    }

    private determineActions(url: string): void {
        if ( url !== '/login' ) {
            this.userService.getCurrentUser().subscribe((user: User) => {
                this.currentUser = user;
                if ( user && user.role ) {
                    this.sideMenuActions.forEach(( action: SideMenuNav ) => {
                        // step 1 check if action only needs to show at an specific url.
                        if (action.urlGroup) {
                            action.urlGroup.forEach((urlGroup) => {
                                action.show = urlGroup === url;
                            });
                        }
                        // step 2 check if action needs admin and if users has rights.
                        action.show = action.needsAdmin ? user.role.getName() === 'admin' : true;

                        if (action.show && action.moduleName) {
                            if (this.organisation) {
                                const m: Module = this.organisation.modules.find(module => module.name === action.moduleName);
                                m ? action.show = m.on : action.show = false;
                            } else {
                                action.show = false;
                            }
                        }
                    });
                }
            });
        }
    }

    private defineSideMenuActions(): void {
        const projects: SideMenuNav = {
            onClick: () => {
                this.router.navigate(['projecten']);
            },
            iconName: 'library_books',
            name: 'Projecten',
            show: true,
            needsAdmin: false,
        };
        const showUsers: SideMenuNav = {
            onClick: () => {
                this.router.navigate(['gebruikers']);
            },
            iconName: 'group',
            name: 'Gebruikers',
            show: true,
            needsAdmin: true,
        };
        const templates: SideMenuNav = {
            onClick: () => {
                this.router.navigate(['templates']);
            },
            iconName: 'collections',
            name: 'Template Beheer',
            show: true,
            needsAdmin: true,
            moduleName: 'Templates',
        };
        const corporateIdentity: SideMenuNav = {
            onClick: () => {
                this.router.navigate(['huisstijl']);
            },
            iconName: 'collections',
            name: 'Huisstijl',
            show: true,
            needsAdmin: true,
            moduleName: 'Branding'
        };
        const logout: SideMenuNav = {
            onClick: this.logoutCurrentUser.bind(this),
            iconName: 'exit_to_app',
            name: 'Uitloggen',
            show: true,
            needsAdmin: false,
        };

        this.sideMenuActions.push(projects, showUsers, templates, corporateIdentity, logout);
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

    private getHoverColor(color: string): string {
        color = color.replace('#', '');
        const r = parseInt(color.substring(0, 2), 16);
        const g = parseInt(color.substring(2, 4), 16);
        const b = parseInt(color.substring(4, 6), 16);

        return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + 40 / 100 + ')';
    }

}
