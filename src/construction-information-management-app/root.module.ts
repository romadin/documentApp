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
import { ProjectRowComponent } from './overview/project-row/project-row.component';
import { ProjectDetailComponent } from './project-detail/project-detail.component';
import { DocumentOverviewComponent } from './document-overview/document-overview.component';
import { FolderRowComponent } from './project-detail/folder-row/folder-row.component';
import { CanActivateAlreadyLoggedIn } from '../can-activate/CanActivateAlreadyLoggedIn';
import { UserService } from '../shared/packages/user-package/user.service';
import { RoleService } from '../shared/packages/role-package/role.service';

const appRoutes: Routes = [
    { path: 'login', component: LoginComponent, canActivate: [ CanActivateAlreadyLoggedIn ] },
    { path: 'overview', component: OverviewComponent, canActivate: [ CanActivateLoggedIn ] },
    { path: 'project/:id', component: ProjectDetailComponent, canActivate: [ CanActivateLoggedIn ]  },
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
        OverviewComponent,
        ProjectRowComponent,
        ProjectDetailComponent,
        DocumentOverviewComponent,
        FolderRowComponent,
    ],
    imports: [
        RouterModule.forRoot( appRoutes ),
        BrowserModule,
        ReactiveFormsModule,
        MaterialModule,
        HttpClientModule,
        RouterModule,
    ],
    providers: [ AuthService, ApiService, ProjectService, UserService, RoleService, CanActivateLoggedIn, CanActivateAlreadyLoggedIn ],
    bootstrap: [ ConstructionInformationManagementComponent ]
})
export class RootModule { }
