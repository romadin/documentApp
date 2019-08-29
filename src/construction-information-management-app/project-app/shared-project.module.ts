import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularEditorModule } from '@kolkov/angular-editor';

import { MaterialModule } from '../../shared/material.module';
import { WorkFunctionEditComponent } from '../templates-app/template/work-function-edit/work-function-edit.component';
import { DocumentDetailPublicComponent } from '../work-function-app/document-detail/document-detail-public/document-detail-public.component';
import { DocumentDetailComponent } from '../work-function-app/document-detail/document-detail.component';

@NgModule({
    declarations: [
        DocumentDetailComponent,
        DocumentDetailPublicComponent,
        WorkFunctionEditComponent
    ],
    imports: [
        AngularEditorModule,
        CommonModule,
        MaterialModule,
        ReactiveFormsModule,
        FormsModule,
    ],
    exports: [
        DocumentDetailComponent,
        DocumentDetailPublicComponent,
        WorkFunctionEditComponent,
    ]

})
export class SharedProjectModule { }
