import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { ColorPickerModule } from 'ngx-color-picker';
import { SharedModule } from '../../shared/shared.module';
import { SharedProjectModule } from '../project-app/shared-project.module';
import { CorporateIdentityComponent } from './corporate-identity/corporate-identity.component';
import { ColorPickerDetailComponent } from './corporate-identity/color-picker-detail/color-picker-detail.component';

const routes: Routes = [
    {
        path: '',
        component: CorporateIdentityComponent,
    }
];

@NgModule({
    declarations: [
        CorporateIdentityComponent,
        ColorPickerDetailComponent
    ],
    imports: [
        SharedModule,
        RouterModule.forChild(routes),
        AngularEditorModule,
        SharedProjectModule,
        ColorPickerModule,
    ],
})
export class CorporateIdentityAppModule { }
