import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { MatButtonToggleChange } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { animate, keyframes, style, transition, trigger } from '@angular/animations';

import { UserService } from '../../../shared/packages/user-package/user.service';
import { User } from '../../../shared/packages/user-package/user.model';
import { Organisation } from '../../../shared/packages/organisation-package/organisation.model';
import { UsersCommunicationService } from '../../../shared/service/communication/users-communication.service';
import { HeaderWithFolderCommunicationService } from '../../../shared/service/communication/HeaderWithFolder.communication.service';

export type RightSideView = 'new' | 'list';
@Component({
    selector: 'cim-partners',
    templateUrl: './partners.component.html',
    styleUrls: ['./partners.component.css'],
    animations: [
        trigger('slideIn', [
            transition('void => *', [
                style({ width: '0', order: '1' }),
                animate('300ms 300ms cubic-bezier(0.4, 0, 0.2, 1)', style({ width: '100%' })),
            ]),
            transition('* => void', [
                animate('300ms cubic-bezier(0.4, 0, 0.2, 1)', keyframes([
                    style({ width: '0' })
                ])),
            ])
        ]),
    ]
})
export class PartnersComponent implements OnInit, OnDestroy {
    @Input() public projectId: number;
    @Input() currentUser: User;
    @Output() closeView: EventEmitter<boolean> = new EventEmitter<boolean>();

    users: User[];
    allUsers: User[];
    userToEdit: User;
    organisation: Organisation;
    rightSide: RightSideView = 'new';

    constructor(private userService: UserService,
                private usersCommunicationService: UsersCommunicationService,
                private activatedRoute: ActivatedRoute,
                private headerCommunicationService: HeaderWithFolderCommunicationService,
    ) { }

    ngOnInit() {
        this.organisation = <Organisation>this.activatedRoute.snapshot.data.organisation;
        this.userService.getUsers({organisationId: this.organisation.id}).subscribe((users) => {
            this.allUsers = users;
            this.users = users.map(user => user);
            this.users = this.users.filter((user) => user.projectsId.find((id) => id === this.projectId));
        });
        this.headerCommunicationService.showAddUserButton.next(true);
        this.usersCommunicationService.addUserInUserComponent.subscribe(addUser => {
            this.userToEdit = null;
        });
    }
    ngOnDestroy() {
        this.headerCommunicationService.showAddUserButton.next(false);
    }

    addUser(e: Event): void {
        e.preventDefault();
        this.rightSide = 'new';
        this.userToEdit = null;
    }

    determineRightSide(e: MatButtonToggleChange): void {
        this.rightSide = e.value;
    }

    onEditUser(user: User) {
        this.rightSide = 'new';
        this.userToEdit = user;
    }

    onCloseView(event: MouseEvent): void {
        event.stopPropagation();
        this.closeView.emit(true);
    }

    closeUserDetailView(closeView: boolean) {
        if (closeView) {
            this.userToEdit = undefined;
            this.rightSide = 'new';
        }
    }
}
