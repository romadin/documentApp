import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { SharedModule } from '../../shared/shared.module';
import { AuthService } from '../../shared/service/auth.service';
import { ResetPasswordComponent } from './reset-password/reset-password.component';

const routes: Routes = [
    {
        path: 'reset-password',
        component: ResetPasswordComponent,
        data: { animation: 'passwordResetCard'}
    },
    {
        path: '',
        component: LoginComponent,
        data: { animation: 'loginCard'}
    },
];


@NgModule({
    imports: [
        RouterModule.forChild( routes ),
        SharedModule,
    ],
    declarations: [
        LoginComponent,
        ResetPasswordComponent,
    ],
    providers: [AuthService]
})
export class LoginAppModule { }
