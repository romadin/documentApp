import { Component } from '@angular/core';
import { UserService } from '../../shared/packages/user-package/user.service';
import { User } from '../../shared/packages/user-package/user.model';

@Component({
  selector: 'cim-users-overview',
  templateUrl: './users-overview.component.html',
  styleUrls: ['./users-overview.component.css']
})
export class UsersOverviewComponent {
    public users: User[];

    constructor(private userService: UserService) {
        this.userService.getUsers().subscribe((users) => {
            this.users = users;
        });
    }

}
