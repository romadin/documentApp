import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthService } from '../../../shared/service/auth.service';
import { Organisation } from '../../../shared/packages/organisation-package/organisation.model';
import { LoadingService } from '../../../shared/loading.service';

@Component({
    selector: 'cim-login-app',
    templateUrl: './login.component.html',
    styleUrls: [ './login.component.css' ]
})

export class LoginComponent implements OnInit {
    public userForm: FormGroup = new FormGroup({
        email: new FormControl(''),
        password: new FormControl(''),
    });
    private organisation: Organisation;

    constructor (private authService: AuthService,
                 private router: Router,
                 private activatedRoute: ActivatedRoute,
                 private loadingService: LoadingService) {
        this.authService = authService;
        this.router = router;
    }

    ngOnInit() {
        this.organisation = <Organisation>this.activatedRoute.snapshot.data.organisation;
    }

    onSubmit() {
        this.loadingService.isLoading.next(true);
        const email = this.userForm.controls.email.value;
        const params = { organisationId: this.organisation.id };

        this.authService.AuthenticateUser( email, this.userForm.controls.password.value, params).subscribe((gotUser) => {
            this.loadingService.isLoading.next(false);
            if (gotUser === true) {
                // redirect to projects page
                this.router.navigate(['/projecten']);
            } else {
                alert('wrong credentials');
            }
        });
    }

}