import { Component, EventEmitter, Input, Output } from '@angular/core';

import { User } from '../../../shared/packages/user-package/user.model';

@Component({
  selector: 'cim-user-row',
  templateUrl: './user-row.component.html',
  styleUrls: ['./user-row.component.css']
})
export class UserRowComponent {
    @Input() public user: User;
    @Output() public userToEdit: EventEmitter<User> = new EventEmitter<User>();

    constructor() { }

    public editUser (event: MouseEvent) {
        event.preventDefault();
        event.stopPropagation();
        this.userToEdit.emit(this.user);
    }

    public deleteUser (event: MouseEvent) {
        console.log('delete user');
    }
}
