import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Location } from '@angular/common';
import { filter } from 'rxjs/operators';
import { UserService } from '../../shared/packages/user-package/user.service';
import { User } from '../../shared/packages/user-package/user.model';

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
    public routHistory: NavigationEnd[] = [];
    public currentUser: User;


    constructor(
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
            onClick: () => {
                console.log('add project');
            },
            iconName: 'add',
            name: 'addProject',
            show: false,
            needsAdmin: true,
            urlGroup: '/overview',
        };
        this.actions.push(addProject);
    }

    private determineActions(navigation: NavigationEnd): void {
        if ( navigation.url !== '/login' ) {
            this.userService.getCurrentUser().subscribe((user: User) => {
                this.currentUser = user;
                if ( user.getRole() ) {
                    this.actions.forEach(( action: HeaderAction ) => {
                        if ( action.urlGroup === navigation.url && action.needsAdmin ) {
                            action.show = user.getRole().getName() === 'admin';
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
        if ( this.routHistory[0].url === this.routHistory[this.routHistory.length - 1].url ) {
            this.actionBack.show = false;
        }
    }

}
