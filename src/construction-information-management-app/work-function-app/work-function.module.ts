import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CanActivateLoggedIn } from '../../can-activate/CanActivateLoggedIn';
import { getBreadcrumbNameParent, } from '../../shared/helpers/practical-functions';
import { SharedWorkFunctionModule } from '../../shared/shared-work-function.module';
import { CompanyPackageResolverService } from './company/company-package-resolver.service';
import { CompanyComponent } from './company/company.component';
import { ItemsOverviewComponent } from './items-overview/items-overview.component';
import { WorkFunctionPackageResolverService } from './work-function-package-resolver.service';

import { WorkFunctionComponent } from './work-function.component';
import { SharedModule } from '../../shared/shared.module';
import { CompanyRowComponent } from './company/company-row/company-row.component';
import { AddCompaniesListComponent } from './company/company-right-side/add-companies-list/add-companies-list.component';
import { CompanyRightSideComponent } from './company/company-right-side/company-right-side.component';
import { CompanyDetailComponent } from './company/company-right-side/company-detail/company-detail.component';
import { WorkFunctionListComponent } from './work-function-list/work-function-list.component';
import { ProjectWorkFunctionComponent } from '../project-app/project/project-detail/project-work-function/project-work-function.component';
import { SharedProjectModule } from '../project-app/shared-project.module';
import { WorkFunctionItemsRouterComponent } from './work-function-items-router/work-function-items-router.component';
import { CanActivateCompanyModule } from '../../can-activate/CanActivateCompanyModule';

const routes: Routes = [
    {
        path: '',
        component: WorkFunctionComponent,
        children: [
            {
                path: ':id',
                component: WorkFunctionItemsRouterComponent,
                resolve: {
                    parent: WorkFunctionPackageResolverService
                },
                children: [
                    {
                        path: 'bedrijven',
                        component: WorkFunctionItemsRouterComponent,
                        canActivate: [ CanActivateCompanyModule ],
                        data: { breadcrumb: 'Bedrijven' },
                        children: [
                            {
                                path: ':id',
                                component: ItemsOverviewComponent,
                                data: { breadcrumb: getBreadcrumbNameParent },
                                resolve: {
                                    parent: CompanyPackageResolverService
                                }
                            },
                            {
                                path: '',
                                component: CompanyComponent,
                            }
                        ]
                    },
                    {
                        path: '',
                        component: ItemsOverviewComponent,
                        data: {
                            parentUrl: 'projecten/:id/functies',
                            breadcrumb: getBreadcrumbNameParent,
                        },
                    }
                ],
            },
            {
                path: '',
                component: WorkFunctionListComponent
            }
        ],
    }
];

@NgModule({
    imports: [
        SharedModule,
        RouterModule.forChild( routes ),
        SharedWorkFunctionModule,
        SharedProjectModule
    ],
    declarations: [
        CompanyComponent,
        WorkFunctionComponent,
        CompanyRowComponent,
        AddCompaniesListComponent,
        CompanyRightSideComponent,
        CompanyDetailComponent,
        WorkFunctionListComponent,
        ProjectWorkFunctionComponent,
        WorkFunctionItemsRouterComponent,
    ],
    providers: [
        WorkFunctionPackageResolverService,
        CompanyPackageResolverService,
        CanActivateCompanyModule
    ],
})

export class WorkFunctionModule { }
