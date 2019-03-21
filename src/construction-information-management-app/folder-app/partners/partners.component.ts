import { Component, Input, OnInit } from '@angular/core';

import { UserService } from '../../../shared/packages/user-package/user.service';
import { User } from '../../../shared/packages/user-package/user.model';
import { SideMenuCommunicationService } from '../../../shared/packages/communication/sideMenu.communication.service';
import { ActivatedRoute } from '@angular/router';
import { Organisation } from '../../../shared/packages/organisation-package/organisation.model';

@Component({
  selector: 'cim-partners',
  templateUrl: './partners.component.html',
  styleUrls: ['./partners.component.css']
})
export class PartnersComponent implements OnInit {
    @Input() public projectId: number;
    @Input() currentUser: User;

    public users: User[];
    public userToEdit: User;

    constructor(private userService: UserService,
                private sideMenuCommunicationService: SideMenuCommunicationService,
                private activatedRoute: ActivatedRoute
    ) { }

    ngOnInit() {
        const organisation = <Organisation>this.activatedRoute.snapshot.data.organisation;
        this.userService.getUsers({organisationId: organisation.id, projectId: this.projectId}).subscribe((users) => {
            this.users = users.filter((user) => user.projectsId.find((id) => id === this.projectId));
        });
    }

    addUser(e: Event): void {
        e.preventDefault();
        this.sideMenuCommunicationService.triggerAddUserPopup.next(true);
    }

    onDeleteUser(userToDelete: User) {
        this.users.splice(this.users.findIndex((user) => user === userToDelete), 1);
    }

    public onEditUser(user: User) {
        this.userToEdit = user;
    }

    public closeUserDetailView(closeView: boolean) {
        if (closeView) {
            this.userToEdit = undefined;
        }
    }
}
