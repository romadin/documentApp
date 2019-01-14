import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Location } from '@angular/common';
import { filter } from 'rxjs/operators';

interface HeaderAction {
    onClick: (item?) => void;
    iconName: string;
    name: string;
    show: boolean;
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
    public currentRoute: NavigationEnd;


    constructor(
        private location: Location,
        private router: Router
    ) {
        this.defineActions();
    }

    ngOnInit() {
        this.router.events.pipe( filter(event => event instanceof NavigationEnd ) ).subscribe((navigation: NavigationEnd) => {
            this.routHistory.push(navigation);
            this.determineBackAction(this.routHistory);
            this.determineActions(navigation);
            console.log(navigation);
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
        };
        const addProject: HeaderAction = {
            onClick: () => {
                console.log('add project');
            },
            iconName: 'add',
            name: 'addProject',
            show: false,
            urlGroup: '/overview',
        };
        this.actions.push(addProject);
    }

    private determineActions(navigation: NavigationEnd): void {
        this.actions.forEach(( action: HeaderAction ) => {
            action.show = action.urlGroup === navigation.url;
        });
    }

    private determineBackAction(routHistory: NavigationEnd[]) {
        if (routHistory.length > 1 ) {
            this.actionBack.show = true;
        }
        if (this.routHistory[0].url === this.routHistory[this.routHistory.length - 1].url) {
            this.actionBack.show = false;
        }
    }

}
