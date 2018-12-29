import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

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

    public onSubmit() {
        console.log('submit form');
    }

}
