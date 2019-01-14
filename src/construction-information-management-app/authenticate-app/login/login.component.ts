import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AuthService } from '../../../shared/service/auth.service';
import { Router } from '@angular/router';

@Component({
    selector: 'cim-login-app',
    templateUrl: './login.component.html',
    styleUrls: [ './login.component.css' ]
})

export class LoginComponent {
    public userForm: FormGroup = new FormGroup({
        email: new FormControl(''),
        password: new FormControl(''),
    });

    private authService: AuthService;
    private router: Router;

    constructor (authService: AuthService, router: Router) {
        this.authService = authService;
        this.router = router;
    }

    public onSubmit() {
        const email = this.userForm.controls.email.value;

        this.authService.AuthenticateUser(
            email, this.userForm.controls.password.value
        ).then((value) => {
            if (value === true) {
                // redirect to projects page
                this.router.navigate(['overview']);
            } else {
                alert('wrong credentials');
            }
        });
    }

}
