import { Component, Input, OnInit } from '@angular/core';

import { User } from '../../../shared/packages/user-package/user.model';

@Component({
  selector: 'cim-user-row',
  templateUrl: './user-row.component.html',
  styleUrls: ['./user-row.component.css']
})
export class UserRowComponent {
    @Input() public user: User;

    constructor() { }

    public editUser (event: MouseEvent, id: number) {
        console.log('edit user');
    }

    public deleteUser (event: MouseEvent, id: number) {
        console.log('delete user');
    }
}
