import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { UserService } from '../../../shared/packages/user-package/user.service';
import { User } from '../../../shared/packages/user-package/user.model';
import { Organisation } from '../../../shared/packages/organisation-package/organisation.model';
import { LoadingService } from '../../../shared/loading.service';

@Component({
  selector: 'cim-users-overview',
  templateUrl: './users-overview.component.html',
  styleUrls: ['./users-overview.component.css']
})
export class UsersOverviewComponent {
    currentUser: User;
    userToEdit: User;
    public users: User[];
    tempAnimationDelay: boolean;

    constructor(private userService: UserService,
                private activatedRoute: ActivatedRoute,
                private loadingService: LoadingService
    ) {
        this.loadingService.isLoading.next(true);
        const organisation: Organisation = <Organisation>this.activatedRoute.snapshot.data.organisation;
        this.userService.getUsers({organisationId: organisation.id}).subscribe((users) => {
            this.loadingService.isLoading.next(false);
            this.users = users;
        });
        this.currentUser = this.userService.getCurrentUser().getValue();
    }

    onDeleteUser(userToDelete: User): void {
        this.users.splice(this.users.findIndex((user) => user === userToDelete), 1);
    }

    onEditUser(user: User) {
        this.tempAnimationDelay = true;
        this.userToEdit = user;
    }

    closeUserDetailView(close: boolean): void {
        if (close) {
            this.tempAnimationDelay = false;
            setTimeout(() => {
                this.userToEdit = undefined;
            }, 600);
        }
    }
}
