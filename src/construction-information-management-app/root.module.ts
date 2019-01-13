import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';

import { ConstructionInformationManagementComponent } from './construction-information-management.component';
import { LoginComponent } from './authenticate-app/login/login.component';
import { HomeComponent } from './home/home.component';
import { HeaderComponent } from './header/header.component';
import { MaterialModule } from '../shared/material.module';
import { AuthService } from '../shared/service/auth.service';
import { ApiService } from '../shared/service/api.service';
import { OverviewComponent } from './overview/overview.component';
import { CanActivateLoggedIn } from '../can-activate/CanActivateLoggedIn';
import { ProjectService } from '../shared/packages/project-package/project.service';

const appRoutes: Routes = [
    { path: 'overview', component: OverviewComponent, canActivate: [ CanActivateLoggedIn ] },
    { path: 'login', component: LoginComponent },
    {
        path: '',
        redirectTo: '/overview',
        pathMatch: 'full',
    }
];

@NgModule({
    declarations : [
        ConstructionInformationManagementComponent,
        LoginComponent,
        HomeComponent,
        HeaderComponent,
        OverviewComponent
    ],
    imports: [
        RouterModule.forRoot( appRoutes ),
        BrowserModule,
        ReactiveFormsModule,
        MaterialModule,
        HttpClientModule,
        RouterModule,
    ],
    providers: [ AuthService, ApiService, ProjectService, CanActivateLoggedIn ],
    bootstrap: [ ConstructionInformationManagementComponent ]
})
export class RootModule { }
