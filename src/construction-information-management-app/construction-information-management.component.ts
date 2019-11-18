import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { delay, distinctUntilChanged, filter, map } from 'rxjs/operators';
import { Module } from '../shared/packages/module-package/module.model';
import { Organisation } from '../shared/packages/organisation-package/organisation.model';
import { OrganisationService } from '../shared/packages/organisation-package/organisation.service';

import { User } from '../shared/packages/user-package/user.model';
import { UserService } from '../shared/packages/user-package/user.service';
import { MenuAction } from './header/header.component';

import { LoadingService } from '../shared/loading.service';
import { animate, animateChild, group, query, style, transition, trigger } from '@angular/animations';
import { Breadcrumb } from './bread-crumb/bread-crumb.component';

export type ModuleName = 'Templates' | 'Assign chapter company' | 'Branding' | 'Basic ILS';

export interface SideMenuNav extends MenuAction {
    moduleName?: ModuleName;
}
@Component({
    selector: 'cim-root',
    templateUrl: './construction-information-management.component.html',
    styleUrls: [ './construction-information-management.component.css'],
    animations: [
        trigger('routeAnimations', [
            transition('loginCard <=> passwordResetCard', [
                style({ position: 'relative' }),
                query(':enter, :leave', [
                    style({
                        position: 'absolute',
                        left: 0,
                        width: '100%'
                    })
                ]),
                query(':enter', [
                    style({ left: '-100%'})
                ]),
                query(':leave', animateChild()),
                group([
                    query(':leave', [
                        animate('300ms ease-out', style({ left: '100%'}))
                    ]),
                    query(':enter', [
                        animate('300ms ease-out', style({ left: '0%'}))
                    ])
                ]),
                query(':enter', animateChild()),
            ])
        ])
    ]
})
export class ConstructionInformationManagementComponent implements OnInit {
    sideMenuActions: MenuAction[] = [];
    currentUser: User;
    resetHeaderAction = false;
    showIsLoading = false;
    organisation: Organisation;
    breadcrumbs: Breadcrumb[];

    constructor(private dialog: MatDialog,
                private router: Router,
                private userService: UserService,
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
        this.router.events.pipe(filter(event => event instanceof NavigationEnd))
            .pipe(distinctUntilChanged())
            .pipe(map(event => this.buildBreadCrumb(this.activatedRoute.root))).subscribe(breadcrumbs => this.breadcrumbs = breadcrumbs);
    }
    
    prepareRoute(outlet: RouterOutlet) {
        return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
    }

    private buildBreadCrumb(route: ActivatedRoute, url: string = '', breadcrumbs: Array<Breadcrumb> = []): Array<Breadcrumb> {
        // If no routeConfig is available we are on the root path
        let name = route.routeConfig && route.routeConfig.data ? route.routeConfig.data[ 'breadcrumb' ] : '';
        let path = route.routeConfig ? route.routeConfig.path : '';
    
        // If no name is available we don't want to make an breadcrumb of this.
        if (name === undefined) {
            return;
        }

        if (typeof name === 'function') {
            name = name(route);
        }
        if (path === ':id') {
            path = route.snapshot.params.id;
        }
        // In the routeConfig the complete path is not available,
        // so we rebuild it each time
        const nextUrl = `${url}${path}/`;
        const breadcrumb: Breadcrumb = {
            name: name,
            url: nextUrl
        };
        const newBreadcrumbs = name !== '' ? [ ...breadcrumbs, breadcrumb ] : breadcrumbs;
        if (route.firstChild) {
            // If we are not on our current path yet,
            // there will be more children to look after, to build our breadcumb
            return this.buildBreadCrumb(route.firstChild, nextUrl, newBreadcrumbs);
        }
        return newBreadcrumbs;
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
