import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Organisation } from '../../../../shared/packages/organisation-package/organisation.model';
import { User } from '../../../../shared/packages/user-package/user.model';
import { UserService } from '../../../../shared/packages/user-package/user.service';
import { MailService } from '../../../../shared/service/mail.service';
import { OrganisationService } from '../../../../shared/packages/organisation-package/organisation.service';

@Component({
  selector: 'cim-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css']
})
export class UsersListComponent implements OnInit {
    private _users: User[];
    @Output() closeList: EventEmitter<boolean> = new EventEmitter();
    usersSelected: User[];

    private allUsers: User[];
    private organisation: Organisation;
    readonly projectId: number;

    constructor(
        private userService: UserService,
        private activatedRoute: ActivatedRoute,
        private mailService: MailService,
        private organisationService: OrganisationService
    ) {
        this.projectId = parseInt(location.pathname.split('/')[2], 10);

        this.activatedRoute.parent ?
            this.organisation = this.activatedRoute.parent.parent.snapshot.data.organisation :
            this.organisationService.getOrganisation().subscribe(org => this.organisation = org);
    }

    @Input()
    set users(users: User[]) {
        this.allUsers = users.map(user => user);
        const usersToRemove = users.filter(user => user.projectsId.find(pId => pId === this.projectId) || user.isAdmin());
        this._users = users.filter(user => !usersToRemove.find(userToRemove => userToRemove === user));
    }

    get users(): User[] {
        return this._users;
    }

    ngOnInit() {
    }

    saveUsers(e: MouseEvent) {
        e.stopPropagation();
        e.preventDefault();
        const data = new FormData();

        this.usersSelected.forEach(user => {
            user.projectsId.push(this.projectId);
            data.append('projectsId', JSON.stringify(user.projectsId));
            this.userService.editUser(user, data).subscribe(() => {
                this.users.splice(this.users.findIndex(c => c.id === user.id), 1);
                this.mailService.sendProjectAdded(user, this.projectId);
                if (this.users.length === 0) {
                    this.closeList.emit(true);
                }
                this.userService.getUsers({organisationId: this.organisation.id}).next(this.allUsers);
            });
        });
    }

    onCancel(e: MouseEvent) {
        e.stopPropagation();
        e.preventDefault();
        this.closeList.emit(true);
    }
}
