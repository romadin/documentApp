import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CompanyService } from '../../shared/packages/company-package/company.service';
import { SharedWorkFunctionModule } from '../../shared/shared-work-function.module';
import { CompanyComponent } from './company/company.component';

import { WorkFunctionComponent } from './work-function.component';
import { SharedModule } from '../../shared/shared.module';
import { CompanyRowComponent } from './company/company-row/company-row.component';
import { CompanyPopupComponent } from '../popups/company-popup/company-popup.component';
import { AddCompaniesListComponent } from './company/add-companies-list/add-companies-list.component';

const routes: Routes = [
    {
        path: '',
        component: WorkFunctionComponent
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
        CompanyService
    ],
    entryComponents: [
        CompanyPopupComponent,
    ]
})

export class WorkFunctionModule { }
