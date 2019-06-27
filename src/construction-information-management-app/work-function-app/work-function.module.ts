import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CanActivateLoggedIn } from '../../can-activate/CanActivateLoggedIn';
import { SharedWorkFunctionModule } from '../../shared/shared-work-function.module';
import { CompanyPackageResolverService } from './company/company-package-resolver.service';
import { CompanyComponent } from './company/company.component';
import { ItemsOverviewComponent } from './items-overview/items-overview.component';
import { WorkFunctionPackageResolverService } from './work-function-package-resolver.service';

import { WorkFunctionComponent } from './work-function.component';
import { SharedModule } from '../../shared/shared.module';
import { CompanyRowComponent } from './company/company-row/company-row.component';
import { CompanyPopupComponent } from '../popups/company-popup/company-popup.component';
import { AddCompaniesListComponent } from './company/add-companies-list/add-companies-list.component';

const routes: Routes = [
    {
        path: '',
        component: WorkFunctionComponent,
        children: [
            {
                path: 'bedrijven',
                canActivate: [ CanActivateLoggedIn ],
                resolve: {
                    functionPackage: WorkFunctionPackageResolverService
                },
                children: [
                    {
                        path: ':id',
                        component: ItemsOverviewComponent,
                        canActivate: [ CanActivateLoggedIn ],
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
                resolve: {
                    functionPackage: WorkFunctionPackageResolverService
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
        CompanyPopupComponent,
        AddCompaniesListComponent,
    ],
    providers: [
        WorkFunctionPackageResolverService,
        CompanyPackageResolverService
    ],
    entryComponents: [
        CompanyPopupComponent,
    ]
})

export class WorkFunctionModule { }
