import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { SharedModule } from '../../shared/shared.module';
import { AuthService } from '../../shared/service/auth.service';

const routes: Routes = [
    {
        path: '',
        component: LoginComponent,
    },
];


@NgModule({
    imports: [
        RouterModule.forChild( routes ),
        SharedModule,
    ],
    declarations: [
        LoginComponent,
    ],
    providers: [AuthService]
})
export class LoginAppModule { }
