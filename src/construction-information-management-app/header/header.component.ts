import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NavigationEnd, Router } from '@angular/router';
import { Location } from '@angular/common';
import { MatSidenav } from '@angular/material/sidenav';
import { filter } from 'rxjs/operators';

import { UserService } from '../../shared/packages/user-package/user.service';
import { User } from '../../shared/packages/user-package/user.model';
import { RouterService } from '../../shared/service/router.service';
import { HeaderWithFolderCommunicationService } from '../../shared/service/communication/HeaderWithFolder.communication.service';
import { OrganisationService } from '../../shared/packages/organisation-package/organisation.service';
import { Organisation } from '../../shared/packages/organisation-package/organisation.model';

export interface MenuAction {
    onClick: (item?) => void;
    iconName: string;
    name: string;
    show: boolean;
    needsAdmin: boolean;
    urlGroup?: UrlGroup[];
}

type UrlGroup = '/projecten' | '/projecten/:id/functies' | '/projecten/:id/functies/:id' | '/projecten/:id/functies/:id/bedrijven' |
    '/projecten/:id/functies/:id/bedrijven/:id' | '/projecten/:id/acties'| '/projecten/:id/agenda'
    | '/projecten/:id/bim-uitvoeringsplan/:id' | '/templates' | '/gebruikers';

@Component({
  selector: 'cim-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
    @Input() sideNavigation: MatSidenav;
    @Input() organisation: Organisation;

    actions: MenuAction[] = [];
    actionBack: MenuAction;
    actionMenu: MenuAction;
    currentUser: User;
    headerTitle = 'BIM Uitvoeringsplan';
    logoSrc: any;
    public headerAction$;

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
        private location: Location,
        private router: Router,
        private userService: UserService,
        private routerService: RouterService,
        private headerService: HeaderWithFolderCommunicationService,
        private organisationService: OrganisationService,
        private sanitizer: DomSanitizer,
    ) {
    }

    ngOnInit() {
        this.headerAction$ = this.routerService.headerActions$;

        this.defineActions();
        this.determineActions(this.router.url);
        // track if url changes
        this.router.events.pipe( filter(event => event instanceof NavigationEnd ) ).subscribe((navigation: NavigationEnd) => {
            this.routeHistory.push(navigation);
            this.determineActions(navigation.url);
            this.actionBack.show = navigation.url === '/login' || navigation.url === '/not-found/organisation' ?
                false : navigation.url !== '/projecten';
        });

        this.routerService.backRoute.subscribe((backRoute: string) => {
            this.backRoute = backRoute;
        });

        this.headerService.headerTitle.subscribe(title => {
            if (title) {
                this.headerTitle = title;
            }
        });

        if (this.organisation.logo) {
            this.organisation.logo.subscribe((blobValue) => {
                if (blobValue && blobValue.size > 4) {
                    const fileReader = new FileReader();

                    fileReader.addEventListener('loadend', () => {
                        this.logoSrc = this.sanitizer.bypassSecurityTrustUrl(<string>fileReader.result);
                    }, false);
                    fileReader.readAsDataURL(blobValue);
                } else {
                    this.logoSrc = '/assets/images/logoBimUvp.png';
                }
            });
        }
    }

    private defineActions(): void {
        this.actionBack = {
            onClick: this.onBackRouting.bind(this),
            iconName: 'arrow_back_ios',
            name: 'back',
            show: false,
            needsAdmin: false,
        };

        this.actionMenu = {
            onClick: () => { this.sideNavigation.toggle(); },
            iconName: 'menu',
            name: 'menu',
            show: false,
            needsAdmin: false,
        };
    }

    private determineActions(url: string): void {
        if (this.actionMenu.show = url !== '/login' ) {
            this.userService.getCurrentUser().subscribe((user: User) => {
                this.currentUser = user;
                if ( user ) {
                    this.actions.forEach(( action: MenuAction ) => {
                        if ( !action.urlGroup && action.needsAdmin ) {
                            action.show = user.isAdmin();
                        } else if ( action.urlGroup ) {
                            for ( const urlGroup of action.urlGroup ) {
                                if (urlGroup === url) {
                                    action.show = action.needsAdmin ? this.currentUser.isAdmin() : true;
                                    return;
                                }
                                const needToChangeUrlGroup = urlGroup.match(/(:id)/g);
                                if (needToChangeUrlGroup) {
                                    const tempUrlGroup = this.replaceIdForUrlGroup(url, urlGroup);
                                    action.show = tempUrlGroup === url;
                                    if (tempUrlGroup === url) {
                                        action.show = action.needsAdmin ?  user.isAdmin() : true;
                                        return;
                                    }
                                } else {
                                    action.show = urlGroup === url;
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
