import { NgModule } from '@angular/core';
import { ActivatedRoute, RouterModule, Routes } from '@angular/router';
import { CanActivateLoggedIn } from '../../can-activate/CanActivateLoggedIn';
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

const routes: Routes = [
    {
        path: '',
        component: WorkFunctionComponent,
        children: [
            {
                path: 'bedrijven',
                canActivate: [ CanActivateLoggedIn ],
                data: { breadcrumb: 'Bedrijven' },
                resolve: {
                    functionPackage: WorkFunctionPackageResolverService
                },
                children: [
                    {
                        path: ':id',
                        component: ItemsOverviewComponent,
                        canActivate: [ CanActivateLoggedIn ],
                        data: { breadcrumb: (route: ActivatedRoute) => route.snapshot.data.functionPackage.parent.name },
                        resolve: {
                            functionPackage: CompanyPackageResolverService
                        }
                    },
                    {
                        path: '',
                        component: CompanyComponent,
                        canActivate: [ CanActivateLoggedIn ],
                    }
                ]
            },
            {
                path: '',
                component: ItemsOverviewComponent,
                canActivate: [ CanActivateLoggedIn ],
                data: {parentUrl: 'projecten/:id', breadcrumb: (route: ActivatedRoute) => route.snapshot.data.functionPackage.parent.name },
                resolve: {
                    functionPackage: WorkFunctionPackageResolverService,
                }
            }
        ]
    }
];

@NgModule({
    imports: [
        SharedModule,
        RouterModule.forChild( routes ),
        SharedWorkFunctionModule
    ],
    declarations: [
        CompanyComponent,
        WorkFunctionComponent,
        CompanyRowComponent,
        AddCompaniesListComponent,
        CompanyRightSideComponent,
        CompanyDetailComponent,
    ],
    providers: [
        WorkFunctionPackageResolverService,
        CompanyPackageResolverService
    ],
})

export class WorkFunctionModule { }
