import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';

import { MaterialModule } from '../shared/material.module';

// can Activate checks
import { CanActivateLoggedIn } from '../can-activate/CanActivateLoggedIn';
import { CanActivateAlreadyLoggedIn } from '../can-activate/CanActivateAlreadyLoggedIn';


// services
import { ApiService } from '../shared/service/api.service';
import { ProjectService } from '../shared/packages/project-package/project.service';
import { UserService } from '../shared/packages/user-package/user.service';
import { RoleService } from '../shared/packages/role-package/role.service';
import { FolderService } from '../shared/packages/folder-package/folder.service';
import { DocumentService } from '../shared/packages/document-package/document.service';
import { DocumentIconService } from '../shared/packages/document-package/document-icon.service';
import { ActionService } from '../shared/packages/action-package/action.service';
import { ScrollingService } from '../shared/service/scrolling.service';
import { RouterService } from '../shared/service/router.service';
import { HeaderWithFolderCommunicationService } from '../shared/packages/communication/HeaderWithFolder.communication.service';
import { SideMenuCommunicationService } from '../shared/packages/communication/sideMenu.communication.service';

// popup components
import { ProjectPopupComponent } from './popups/project-popup/project-popup.component';
import { UserPopupComponent } from './popups/user-popup/user-popup.component';

// components
import { ConstructionInformationManagementComponent } from './construction-information-management.component';
import { HeaderComponent } from './header/header.component';
import { FolderCommunicationService } from '../shared/packages/communication/Folder.communication.service';
import { ActionCommunicationService } from '../shared/packages/communication/action.communication.service';
import { SharedModule } from '../shared/shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ToastrModule } from 'ng6-toastr-notifications';

const appRoutes: Routes = [
    {
        path: 'login',
        loadChildren: './login-app/login-app.module#LoginAppModule',
        canActivate: [ CanActivateAlreadyLoggedIn ] },
    {
        path: 'gebruikers',
        loadChildren: './user-app/user.module#UserModule',
    },
    {
        path: 'projecten',
        loadChildren: './project-app/project.module#ProjectModule',
        canActivate: [ CanActivateLoggedIn ]
    },
    {
        path: '',
        redirectTo: 'projecten',
        pathMatch: 'full',
    }
];

@NgModule({
    declarations : [
        ConstructionInformationManagementComponent,
        HeaderComponent,
        UserPopupComponent,
        ProjectPopupComponent,
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        MaterialModule,
        HttpClientModule,
        SharedModule,
        ToastrModule.forRoot(),
        RouterModule.forRoot(appRoutes)
    ],
    providers: [
        ApiService,

        ProjectService,
        UserService,
        RouterService,
        HeaderWithFolderCommunicationService,
        ActionCommunicationService,
        ScrollingService,
        RoleService,

        FolderService,
        DocumentService,
        DocumentIconService,
        ActionService,
        FolderCommunicationService,
        SideMenuCommunicationService,
        CanActivateLoggedIn, CanActivateAlreadyLoggedIn,
    ],
    entryComponents: [ ProjectPopupComponent, UserPopupComponent ],
    bootstrap: [ ConstructionInformationManagementComponent ]
})
export class RootModule { }
