import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { AngularEditorModule } from '@kolkov/angular-editor';

import { MaterialModule } from '../shared/material.module';

import { CanActivateLoggedIn } from '../can-activate/CanActivateLoggedIn';
import { CanActivateAlreadyLoggedIn } from '../can-activate/CanActivateAlreadyLoggedIn';
import { CanActivateAdminUser } from '../can-activate/CanActivateAdminUser';

// services
import { AuthService } from '../shared/service/auth.service';
import { ApiService } from '../shared/service/api.service';
import { ProjectService } from '../shared/packages/project-package/project.service';
import { UserService } from '../shared/packages/user-package/user.service';
import { RoleService } from '../shared/packages/role-package/role.service';
import { FolderService } from '../shared/packages/folder-package/folder.service';
import { DocumentService } from '../shared/packages/document-package/document.service';
import { DocumentIconService } from '../shared/packages/document-package/document-icon.service';

// popup components
import { ProjectPopupComponent } from './popups/project-popup/project-popup.component';
import { UserPopupComponent } from './popups/user-popup/user-popup.component';

// components
import { ConstructionInformationManagementComponent } from './construction-information-management.component';
import { LoginComponent } from './authenticate-app/login/login.component';
import { HomeComponent } from './home/home.component';
import { HeaderComponent } from './header/header.component';
import { UsersOverviewComponent } from './users/users-overview.component';
import { UserRowComponent } from './users/user-row/user-row.component';
import { FolderComponent } from './folder/folder.component';
import { DocumentRowComponent } from './folder/document-row/document-row.component';
import { DocumentDetailComponent } from './folder/document-detail/document-detail.component';
import { DocumentOverviewComponent } from './document-overview/document-overview.component';
import { ProjectDetailComponent } from './project-detail/project-detail.component';
import { FolderRowComponent } from './project-detail/folder-row/folder-row.component';
import { OverviewComponent } from './overview/overview.component';
import { ProjectRowComponent } from './overview/project-row/project-row.component';

const appRoutes: Routes = [
    { path: 'login', component: LoginComponent, canActivate: [ CanActivateAlreadyLoggedIn ] },
    { path: 'overview', component: OverviewComponent, canActivate: [ CanActivateLoggedIn ] },
    { path: 'project/:id', component: ProjectDetailComponent, canActivate: [ CanActivateLoggedIn ]  },
    { path: 'folder/:id', component: FolderComponent, canActivate: [ CanActivateLoggedIn ]  },
    { path: 'gebruikers', component: UsersOverviewComponent, canActivate: [ CanActivateAdminUser ]  },
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
        ProjectPopupComponent,
        UserPopupComponent,
        UsersOverviewComponent,
        UserRowComponent,
        FolderComponent,
        DocumentRowComponent,
        DocumentDetailComponent,
    ],
    imports: [
        RouterModule.forRoot( appRoutes ),
        BrowserModule,
        ReactiveFormsModule,
        MaterialModule,
        HttpClientModule,
        RouterModule,
        AngularEditorModule,
        FormsModule,
    ],
    providers: [
        AuthService,
        ApiService,
        ProjectService,
        UserService,
        RoleService,
        FolderService,
        DocumentService,
        DocumentIconService,
        CanActivateLoggedIn, CanActivateAlreadyLoggedIn, CanActivateAdminUser ],
    entryComponents: [ ProjectPopupComponent, UserPopupComponent ],
    bootstrap: [ ConstructionInformationManagementComponent ]
})
export class RootModule { }
