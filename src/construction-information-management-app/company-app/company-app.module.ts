import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from '../../shared/shared.module';
import { CompanyComponent } from './company/company.component';

const routes: Routes = [
    {
        path: '',
        component: CompanyComponent
    }
];
@NgModule({
    declarations: [CompanyComponent],
    imports: [
        SharedModule,
        RouterModule.forChild(routes)
    ]
})
export class CompanyAppModule { }
