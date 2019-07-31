import { Component } from '@angular/core';
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
  styleUrls: ['./users-overview.component.css']
})
export class UsersOverviewComponent {
    currentUser: User;
    userToEdit: User;
    users: User[];
    organisation: Organisation;
    tempAnimationDelay: boolean;
    rightSideActive = false;

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
            this.tempAnimationDelay = true;
            this.rightSideActive = addUser;
            this.userToEdit = undefined;
        });

        this.currentUser = this.userService.getCurrentUser().getValue();
    }

    onEditUser(user: User) {
        this.tempAnimationDelay = true;
        this.rightSideActive = false;
        this.userToEdit = undefined;
        setTimeout(() => {
            this.userToEdit = user;
            this.rightSideActive = true;
        });
    }

    closeUserDetailView(close: boolean): void {
        if (close) {
            this.tempAnimationDelay = false;
            setTimeout(() => {
                this.userToEdit = undefined;
                this.rightSideActive = false;
            }, 600);
        }
    }
}
