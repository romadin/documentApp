import { RouterModule, Routes } from '@angular/router';
import { LOCALE_ID, NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { ToastrModule } from 'ng6-toastr-notifications';
import { registerLocaleData } from '@angular/common';
import localeNl from '@angular/common/locales/nl';
import { CanActivateAdminUser } from '../can-activate/CanActivateAdminUser';


import { MaterialModule } from '../shared/material.module';

// can Activate checks
import { CanActivateLoggedIn } from '../can-activate/CanActivateLoggedIn';
import { CanActivateAlreadyLoggedIn } from '../can-activate/CanActivateAlreadyLoggedIn';
import { CompanyService } from '../shared/packages/company-package/company.service';
import { ContextMenuService } from '../shared/packages/context-menu/context-menu.service';
import { ModuleService } from '../shared/packages/module-package/module.service';
import { ProjectResolver } from '../shared/packages/project-package/project.resolver';


// services
import { ApiService } from '../shared/service/api.service';
import { ProjectService } from '../shared/packages/project-package/project.service';
import { UserService } from '../shared/packages/user-package/user.service';
import { RoleService } from '../shared/packages/role-package/role.service';
import { DocumentService } from '../shared/packages/document-package/document.service';
import { DocumentIconService } from '../shared/packages/document-package/document-icon.service';
import { ActionService } from '../shared/packages/action-package/action.service';
import { ScrollingService } from '../shared/service/scrolling.service';
import { RouterService } from '../shared/service/router.service';
import { HeaderWithFolderCommunicationService } from '../shared/service/communication/HeaderWithFolder.communication.service';
import { FolderCommunicationService } from '../shared/service/communication/Folder.communication.service';

// popup components
import { ProjectPopupComponent } from './popups/project-popup/project-popup.component';
import { UserPopupComponent } from './popups/user-popup/user-popup.component';

// components
import { ConstructionInformationManagementComponent } from './construction-information-management.component';
import { HeaderComponent } from './header/header.component';
import { SharedModule } from '../shared/shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastService } from '../shared/toast.service';
import { LoadingService } from '../shared/loading.service';
import { OrganisationService } from '../shared/packages/organisation-package/organisation.service';
import { OrganisationResolver } from '../shared/packages/organisation-package/organisation.resolver';
import { ConfirmPopupComponent } from './popups/confirm-popup/confirm-popup.component';
import { MailService } from '../shared/service/mail.service';
import { OrganisationNotFoundComponent } from './not-found/organisation-not-found/organisation-not-found.component';
import { CanActivateNoOrganisation } from '../can-activate/CanActivateNoOrganisation';
import { TemplateService } from '../shared/packages/template-package/template.service';
import { WorkFunctionService } from '../shared/packages/work-function-package/work-function.service';
import { ChapterService } from '../shared/packages/chapter-package/chapter.service';
import { CacheService } from '../shared/service/cache.service';
import { BreadCrumbComponent } from './bread-crumb/bread-crumb.component';
import { ContextMenuComponent } from './context-menu/context-menu.component';
import { CanActivateTemplateModule } from '../can-activate/CanActivateTemplateModule';

registerLocaleData(localeNl, 'nl');

const appRoutes: Routes = [
    {
        path: 'login',
        loadChildren: './login-app/login-app.module#LoginAppModule',
        canActivate: [ CanActivateAlreadyLoggedIn ],
        resolve: { organisation: OrganisationResolver }
    },
    {
        path: 'gebruikers',
        loadChildren: './user-app/user.module#UserModule',
        data: { breadcrumb: 'Gebruikers'},
        resolve: { organisation: OrganisationResolver }
    },
    {
        path: 'templates',
        loadChildren: './templates-app/templates.module#TemplatesModule',
        canActivate: [ CanActivateAdminUser, CanActivateTemplateModule ],
        data: { breadcrumb: 'Templates'},
        resolve: { organisation: OrganisationResolver }
    },
    {
        path: 'huisstijl',
        loadChildren: './corporate-identity-app/corporate-identity-app.module#CorporateIdentityAppModule',
        canActivate: [ CanActivateAdminUser ],
        data: { breadcrumb: 'Huisstijl'},
        resolve: { organisation: OrganisationResolver }
    },
    {
        path: 'projecten',
        loadChildren: './project-app/project.module#ProjectModule',
        canActivate: [ CanActivateLoggedIn ],
        resolve: { organisation: OrganisationResolver }
    },
    {
        path: '',
        redirectTo: 'projecten',
        pathMatch: 'full',
    },
    {
        path: 'not-found/organisation',
        component: OrganisationNotFoundComponent,
        canActivate: [ CanActivateNoOrganisation ],
    },
    { path: '**', redirectTo: 'not-found/organisation'}
];

@NgModule({
    declarations : [
        ConstructionInformationManagementComponent,
        HeaderComponent,
        UserPopupComponent,
        ProjectPopupComponent,
        ConfirmPopupComponent,
        OrganisationNotFoundComponent,
        BreadCrumbComponent,
        ContextMenuComponent,
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
        { provide: LOCALE_ID, useValue: 'nl'},
        ApiService,
        CacheService,
        ContextMenuService,

        ProjectService,
        UserService,
        RouterService,
        ScrollingService,
        RoleService,

        TemplateService,
        WorkFunctionService,
        CompanyService,
        ChapterService,

        FolderCommunicationService,
        HeaderWithFolderCommunicationService,

        DocumentService,
        DocumentIconService,
        ActionService,
        ToastService,
        LoadingService,
        MailService,

        ModuleService,
        OrganisationService,
        OrganisationResolver,
        ProjectResolver,
        CanActivateLoggedIn, CanActivateAlreadyLoggedIn, CanActivateNoOrganisation,
        CanActivateAdminUser, CanActivateTemplateModule
    ],
    entryComponents: [
        UserPopupComponent,
        ProjectPopupComponent,
        ConfirmPopupComponent,
    ],
    bootstrap: [ ConstructionInformationManagementComponent ]
})
export class RootModule { }
