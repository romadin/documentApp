import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { MatButtonToggleChange } from '@angular/material/button-toggle';
import { ActivatedRoute } from '@angular/router';
import { animate, keyframes, style, transition, trigger } from '@angular/animations';

import { UserService } from '../../../shared/packages/user-package/user.service';
import { User } from '../../../shared/packages/user-package/user.model';
import { Organisation } from '../../../shared/packages/organisation-package/organisation.model';
import { HeaderWithFolderCommunicationService } from '../../../shared/service/communication/HeaderWithFolder.communication.service';
import { RouterService } from '../../../shared/service/router.service';
import { MenuAction } from '../../header/header.component';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

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
export class PartnersComponent implements OnInit {
    @Input() public projectId: number;
    @Input() currentUser: User;
    @Output() closeView: EventEmitter<boolean> = new EventEmitter<boolean>();

    public users$: Observable<User[]>;
    public userToEdit: User;
    public organisation: Organisation;
    public rightSide: RightSideView = 'new';

    constructor(private userService: UserService,
                private activatedRoute: ActivatedRoute,
                private headerCommunicationService: HeaderWithFolderCommunicationService,
                private readonly routerService: RouterService
    ) { }

    ngOnInit() {
        const addUser: MenuAction = {
            onClick: this.addUser.bind(this),
            iconName: 'person_add',
            name: 'Gebruiker toevoegen',
            show: false,
            needsAdmin: true,
        };
        this.routerService.setHeaderAction([addUser]);
        this.organisation = <Organisation>this.activatedRoute.parent.parent.snapshot.data.organisation;

        this.users$ = this.userService.getUsers({organisationId: this.organisation.id}).pipe(
            map(users => users.filter(user => user.projectsId.find((id) => id === this.projectId)))
        );
    }

    addUser(e?: Event): void {
        if (e) {
            e.preventDefault();
        }
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
