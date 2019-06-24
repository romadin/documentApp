import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedWorkFunctionModule } from '../../shared/shared-work-function.module';

import { WorkFunctionComponent } from './work-function.component';
import { SharedModule } from '../../shared/shared.module';

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
        WorkFunctionComponent,
    ],
})

export class WorkFunctionModule { }
