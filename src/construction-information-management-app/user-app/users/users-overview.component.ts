import { animate, animateChild, keyframes, query, stagger, state, style, transition, trigger } from '@angular/animations';
import { AfterViewInit, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { UserService } from '../../../shared/packages/user-package/user.service';
import { User } from '../../../shared/packages/user-package/user.model';
import { Organisation } from '../../../shared/packages/organisation-package/organisation.model';
import { LoadingService } from '../../../shared/loading.service';
import { HeaderWithFolderCommunicationService } from '../../../shared/service/communication/HeaderWithFolder.communication.service';
import { UsersCommunicationService } from '../../../shared/service/communication/users-communication.service';

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
                width: '100%'
            })),
            state('smallWidth', style({
                width: '50%'
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
                style({ transform: 'scale(0.5)', opacity: 0 }),  // initial
                animate('1s cubic-bezier(.8, -0.6, 0.2, 1.5)',
                    style({ transform: 'scale(1)', opacity: 1 })
                )  // final
            ]),
            transition('* => void', [
                style({ transform: 'scale(1)', opacity: 1, height: '*' }),
                animate('1s cubic-bezier(.8, -0.6, 0.2, 1.5)',
                    style({
                        transform: 'scale(0.5)', opacity: 0,
                        height: '0px', margin: '0px'
                    })
                )
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

    constructor(private userService: UserService,
                private activatedRoute: ActivatedRoute,
                private loadingService: LoadingService,
                private usersCommunication: UsersCommunicationService,
                private headerCommunication: HeaderWithFolderCommunicationService,
    ) {
        this.loadingService.isLoading.next(true);
        this.headerCommunication.headerTitle.next('Gebruikers beheer');
        this.organisation = <Organisation>this.activatedRoute.snapshot.data.organisation;
        this.userService.getUsers({organisationId: this.organisation.id}).subscribe((users) => {
            this.loadingService.isLoading.next(false);
            this.users = users;
        });

        this.usersCommunication.addUserInUserComponent.subscribe(addUser => {
            const timer = this.rightSideActive ? UsersOverviewComponent.animationDelay : 0;
            this.userToEdit = undefined;
            this.rightSideActive = false;
            setTimeout(() => {
                this.rightSideActive = addUser;
            }, timer);
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
}
