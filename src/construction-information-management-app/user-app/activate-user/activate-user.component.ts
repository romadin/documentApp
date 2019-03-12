import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { User } from '../../../shared/packages/user-package/user.model';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../../shared/packages/user-package/user.service';

export interface UserActivation extends User {
    activationToken: string;
}
@Component({
  selector: 'cim-activate-user',
  templateUrl: './activate-user.component.html',
  styleUrls: ['./activate-user.component.css']
})
export class ActivateUserComponent implements OnInit {
    // @todo add the password repeat for better security.
    public passwordForm: FormGroup = new FormGroup({
        password: new FormControl(''),
        // passwordRepeat: new FormControl(''),
    });
    public user: UserActivation;

  constructor(private activatedRoute: ActivatedRoute,
              private userService: UserService,
              private router: Router) {
  }

  ngOnInit() {
      this.user = <UserActivation>this.activatedRoute.snapshot.data.user;
  }

  public onSubmit(): void {
      const params = { params: {activationToken: this.user.activationToken}};

      this.userService.activateUser(this.user, {password: this.passwordForm.controls.password.value}, params).subscribe((user) => {
          if (user) {
              this.router.navigate(['/login']);
              return;
          }
      });
  }

}
