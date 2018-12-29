import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import {AuthService} from '../../../shared/service/auth.service';

@Component({
    selector: 'cim-login-app',
    templateUrl: './login.component.html',
    styleUrls: [ './login.component.css' ]
})

export class LoginComponent {
    public userForm: FormGroup = new FormGroup({
        userName: new FormControl(''),
        password: new FormControl(''),
    });
    private authService: AuthService;

    constructor (authService: AuthService) {
        this.authService = authService;
    }

    public onSubmit() {
        console.log('submit form');
        debugger;
    }

}
