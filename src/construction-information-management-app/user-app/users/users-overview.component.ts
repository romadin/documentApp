import {
    animate,
    animateChild,
    keyframes,
    query,
    stagger,
    state,
    style,
    transition,
    trigger,
    useAnimation
} from '@angular/animations';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { UserService } from '../../../shared/packages/user-package/user.service';
import { User } from '../../../shared/packages/user-package/user.model';
import { Organisation } from '../../../shared/packages/organisation-package/organisation.model';
import { LoadingService } from '../../../shared/loading.service';
import { HeaderWithFolderCommunicationService } from '../../../shared/service/communication/HeaderWithFolder.communication.service';
import { initialAnimation, scaleDownAnimation } from '../../../shared/animations';
import { MenuAction } from '../../header/header.component';
import { RouterService } from '../../../shared/service/router.service';
import { DefaultPopupData } from '../../popups/project-popup/project-popup.component';
import { UserPopupComponent } from '../../popups/user-popup/user-popup.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
    selector: 'cim-users-overview',
    templateUrl: './users-overview.component.html',
    styleUrls: ['./users-overview.component.css'],
    animations: [
        trigger('toggleInView', [
            state('close', style({
                transform: 'translateX(110%)'
            })),
            state('open', style({
                width: '48%',
                transform: 'translateX(0)'
            })),
            transition('close => open', [
                animate('300ms cubic-bezier(0.0, 0.0, 0.2, 1)')
            ]),
            transition('open => close', [
                animate('300ms cubic-bezier(0.0, 0.0, 0.2, 1)', keyframes([
                    style({ transform: 'translateX(5%)', offset: 0.1}),
                    style({ transform: 'translateX(10%)', offset: 0.8}),
                    style({ transform: 'translateX(110%)', offset: 1}),
                ]))
            ]),
            transition('void => *', [
                style({ transform: 'translateX(110%)' }),
                animate('300ms cubic-bezier(0.0, 0.0, 0.2, 1)', style({ transform: 'translateX(0)'})),
            ]),
            transition('* => void', [
                animate('300ms cubic-bezier(0.0, 0.0, 0.2, 1)', keyframes([
                    style({ opacity: '0'})
                ])),
            ])
        ]),
        trigger('resizeWidth', [
            state('fullWidth', style({
                width: '100%',
                overflowY: 'auto',
                overflowX: 'hidden',
            })),
            state('smallWidth', style({
                width: '50%',
                overflowY: 'auto',
                overflowX: 'hidden',
            })),
            transition('smallWidth <=> fullWidth', [
                animate('350ms cubic-bezier(0.0, 0.0, 0.2, 1)')
            ]),
            transition('void => *', [
                query('@items', stagger(250, animateChild()), { optional: true })
            ]),
        ]),
        trigger('items', [
            transition('void => *', [
                useAnimation(initialAnimation)
            ]),
            transition('* => void', [
                useAnimation(scaleDownAnimation)
            ])
        ])
    ]
})
export class UsersOverviewComponent {
    private static animationDelay = 300;
    currentUser: User;
    userToEdit: User;
    users: User[];
    organisation: Organisation;
    rightSideActive: boolean;

    constructor(
        public dialog: MatDialog,
        private userService: UserService,
        private activatedRoute: ActivatedRoute,
        private loadingService: LoadingService,
        private headerCommunication: HeaderWithFolderCommunicationService,
        private readonly router: Router,
        private readonly routerService: RouterService,
    ) {
        const addUser: MenuAction = {
            onClick: this.openDialogAddUser.bind(this),
            iconName: 'person_add',
            name: 'Gebruiker toevoegen',
            show: false,
            needsAdmin: true,
        };
        this.routerService.setHeaderAction([addUser]);
        this.loadingService.isLoading.next(true);
        this.headerCommunication.headerTitle.next('Gebruikers beheer');
        this.organisation = <Organisation>this.activatedRoute.snapshot.data.organisation;

        this.userService.getUsers({organisationId: this.organisation.id}).subscribe((users) => {
            this.loadingService.isLoading.next(false);
            this.users = users;
        });

        this.currentUser = this.userService.getCurrentUser().getValue();
    }

    onEditUser(user: User) {
        if (user !== this.userToEdit) {
            const timer = this.rightSideActive ? UsersOverviewComponent.animationDelay : 0;
            this.rightSideActive = false;
            this.userToEdit = undefined;
            setTimeout(() => {
                this.userToEdit = user;
                this.rightSideActive = true;
            }, timer);
        }
    }

    closeUserDetailView(close: boolean): void {
        this.userToEdit = undefined;
        this.rightSideActive = false;
    }

    private addUserInUserComponent(addUser: boolean): void {
        this.userToEdit = undefined;
        this.rightSideActive = false;
        setTimeout(() => {
            this.rightSideActive = addUser;
        }, this.rightSideActive ? UsersOverviewComponent.animationDelay : 0);
    }

    private openDialogAddUser(): void {
        const url = this.router.url;
        if (url === '/gebruikers' || url === '/projecten/') {
            this.addUserInUserComponent(true);
            return;
        }
        const data: DefaultPopupData = {
            title: 'Voeg een gebruiker toe',
            placeholder: 'Gebruiker',
            submitButton: 'Voeg toe',
            organisation: this.organisation,
        };
        const dialogRef = this.dialog.open(UserPopupComponent, {
            width: '600px',
            data: data,
        });
        dialogRef.afterClosed().subscribe();
    }
}
