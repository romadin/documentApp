import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { SharedModule } from '../../shared/shared.module';
import { SharedProjectModule } from '../project-app/shared-project.module';
import { CorporateIdentityComponent } from './corporate-identity/corporate-identity.component';

const routes: Routes = [
    {
        path: '',
        component: CorporateIdentityComponent,
    }
];

@NgModule({
    declarations: [
        CorporateIdentityComponent
    ],
    imports: [
        SharedModule,
        RouterModule.forChild(routes),
        AngularEditorModule,
        SharedProjectModule,
    ],
})
export class CorporateIdentityAppModule { }
