import { Component, Input, OnInit } from '@angular/core';
import { UserService } from '../../../shared/packages/user-package/user.service';
import { User } from '../../../shared/packages/user-package/user.model';

@Component({
  selector: 'cim-partners',
  templateUrl: './partners.component.html',
  styleUrls: ['./partners.component.css']
})
export class PartnersComponent implements OnInit {
    @Input() public projectId: number;

    public users: User[];

    constructor(private userService: UserService) { }

    ngOnInit() {
        this.userService.getUsers({projectId: this.projectId}).subscribe((users: User[]) => {
            this.users = users;
            console.log(this.users);
        });
    }

}
