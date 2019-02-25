import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { AngularEditorModule } from '@kolkov/angular-editor';

import { MaterialModule } from '../shared/material.module';

// can Activate checks
import { CanActivateLoggedIn } from '../can-activate/CanActivateLoggedIn';
import { CanActivateAlreadyLoggedIn } from '../can-activate/CanActivateAlreadyLoggedIn';
import { CanActivateAdminUser } from '../can-activate/CanActivateAdminUser';

// resolvers
import { UserResolver } from '../shared/packages/user-package/user.resolver';

// services
import { AuthService } from '../shared/service/auth.service';
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
import { ProjectDetailComponent } from './project-detail/project-detail.component';
import { FolderRowComponent } from './project-detail/folder-row/folder-row.component';
import { OverviewComponent } from './overview/overview.component';
import { ProjectRowComponent } from './overview/project-row/project-row.component';
import { ItemListComponent } from './folder/item-list/item-list.component';
import { PartnersComponent } from './folder/partners/partners.component';
import { UserDetailComponent } from './users/user-detail/user-detail.component';
import { ActionListComponent } from './action-list/action-list.component';
import { ItemComponent } from './action-list/item/item.component';
import { ItemDetailComponent } from './action-list/item-detail/item-detail.component';
import { ProjectComponent } from './project/project.component';
import { ActivateUserComponent } from './authenticate-app/activate-user/activate-user.component';
import { ItemCreateComponent } from './folder/item-create/item-create.component';
import { DetailFolderComponent } from './folder/item-create/create-folder/detail-folder.component';
import { CreateDocumentComponent } from './folder/item-create/create-document/create-document.component';
import { FolderCommunicationService } from '../shared/packages/communication/Folder.communication.service';

const appRoutes: Routes = [
    { path: 'login', component: LoginComponent, canActivate: [ CanActivateAlreadyLoggedIn ] },
    {
        path: 'activate/:token',
        component: ActivateUserComponent,
        resolve: {user: UserResolver}
    },
    { path: 'gebruikers', component: UsersOverviewComponent, canActivate: [ CanActivateAdminUser ]  },
    { path: 'overview', component: OverviewComponent, canActivate: [ CanActivateLoggedIn ] },
    {
        path: 'project/:id',
        component: ProjectComponent,
        canActivate: [ CanActivateLoggedIn ],
        children: [
            { path: 'folder/:id', component: FolderComponent, canActivate: [ CanActivateLoggedIn ]  },
            { path: 'actionList/:id', component: ActionListComponent, canActivate: [ CanActivateLoggedIn ]  },
            { path: '', component: ProjectDetailComponent, canActivate: [ CanActivateLoggedIn ] },
        ]
    },
    {
        path: '',
        redirectTo: 'overview',
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
        FolderRowComponent,
        ProjectPopupComponent,
        UserPopupComponent,
        UsersOverviewComponent,
        UserRowComponent,
        FolderComponent,
        DocumentRowComponent,
        DocumentDetailComponent,
        ItemListComponent,
        PartnersComponent,
        UserDetailComponent,
        ActionListComponent,
        ItemComponent,
        ItemDetailComponent,
        ProjectComponent,
        ActivateUserComponent,
        ItemCreateComponent,
        DetailFolderComponent,
        CreateDocumentComponent,
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
        ActionService,
        RouterService,
        ScrollingService,
        HeaderWithFolderCommunicationService,
        FolderCommunicationService,
        UserResolver,
        CanActivateLoggedIn, CanActivateAlreadyLoggedIn, CanActivateAdminUser ],
    entryComponents: [ ProjectPopupComponent, UserPopupComponent ],
    bootstrap: [ ConstructionInformationManagementComponent ]
})
export class RootModule { }
