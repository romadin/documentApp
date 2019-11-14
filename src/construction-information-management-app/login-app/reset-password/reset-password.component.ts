import { Component, OnInit } from '@angular/core';
import { LoadingService } from '../../../shared/loading.service';
import { AuthService } from '../../../shared/service/auth.service';
import { FormControl, FormGroup } from '@angular/forms';
import { Organisation } from '../../../shared/packages/organisation-package/organisation.model';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from '../../../shared/toast.service';


@Component({
    selector: 'cim-reset-password',
    templateUrl: './reset-password.component.html',
    styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
    resetPasswordForm: FormGroup = new FormGroup({ email: new FormControl('') });
    private organisation: Organisation;
    
    constructor(private loadingService: LoadingService,
                private authService: AuthService,
                private activatedRoute: ActivatedRoute,
                private toast: ToastService,
                private router: Router,
    ) { }
    
    ngOnInit() {
        this.organisation = <Organisation>this.activatedRoute.snapshot.data.organisation;
    }
    
    onSubmit() {
        this.loadingService.isLoading.next(true);
        const body = {
            email:  this.resetPasswordForm.controls.email.value,
            organisationId:  this.organisation.id
        };
        this.authService.resetPassword( body ).subscribe((worked: boolean) => {
            this.loadingService.isLoading.next(false);
                // redirect to projects page
                this.toast.showSuccess('Wachtwoord is gereset, u krijgt een mail', 'Wachtwoord resetten');
                setTimeout(() => {
                    this.router.navigate(['/login']);
                }, 2200);
        }, error => {
            this.loadingService.isLoading.next(false);
            this.toast.showError('Ingevoerde email bestaat niet, neem contact met uw beheerder');
        });
    }

}
