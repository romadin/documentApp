import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';

import { UserService } from '../../../shared/packages/user-package/user.service';
import { User } from '../../../shared/packages/user-package/user.model';
import { UsersCommunicationService } from '../../../shared/service/communication/users-communication.service';
import { ActivatedRoute } from '@angular/router';
import { Organisation } from '../../../shared/packages/organisation-package/organisation.model';
import { animate, keyframes, style, transition, trigger } from '@angular/animations';
import { HeaderWithFolderCommunicationService } from '../../../shared/service/communication/HeaderWithFolder.communication.service';

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

    public users: User[];
    public userToEdit: User;

    constructor(private userService: UserService,
                private usersCommunicationService: UsersCommunicationService,
                private activatedRoute: ActivatedRoute,
                private headerCommunicationService: HeaderWithFolderCommunicationService,
    ) { }

    ngOnInit() {
        const organisation = <Organisation>this.activatedRoute.snapshot.data.organisation;
        this.userService.getUsers({organisationId: organisation.id, projectId: this.projectId}).subscribe((users) => {
            this.users = users.filter((user) => user.projectsId.find((id) => id === this.projectId));
        });
        this.headerCommunicationService.showAddUserButton.next(true);
    }
    ngOnDestroy() {
        this.headerCommunicationService.showAddUserButton.next(false);
    }

    addUser(e: Event): void {
        e.preventDefault();
        this.usersCommunicationService.triggerAddUserPopup.next(true);
    }

    onDeleteUser(userToDelete: User) {
        this.users.splice(this.users.findIndex((user) => user === userToDelete), 1);
    }

    onEditUser(user: User) {
        this.userToEdit = user;
    }

    onCloseView(event: MouseEvent): void {
        event.stopPropagation();
        this.closeView.emit(true);
    }

    closeUserDetailView(closeView: boolean) {
        if (closeView) {
            this.userToEdit = undefined;
        }
    }
}
