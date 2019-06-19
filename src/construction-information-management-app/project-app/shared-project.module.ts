import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularEditorModule } from '@kolkov/angular-editor';

import { MaterialModule } from '../../shared/material.module';
import { WorkFunctionEditComponent } from '../templates-app/template/work-function-edit/work-function-edit.component';
import { DocumentDetailPublicComponent } from '../work-function-app/document-detail/document-detail-public/document-detail-public.component';
import { DocumentDetailComponent } from '../work-function-app/document-detail/document-detail.component';
import { DetailFolderComponent } from '../work-function-app/item-create/create-folder/detail-folder.component';

@NgModule({
    declarations: [
        DetailFolderComponent,
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
        DetailFolderComponent,
        DocumentDetailComponent,
        DocumentDetailPublicComponent,
        WorkFunctionEditComponent,
    ]

})
export class SharedProjectModule { }
