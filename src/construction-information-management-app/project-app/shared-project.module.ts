import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularEditorModule } from '@kolkov/angular-editor';

import { MaterialModule } from '../../shared/material.module';
import { DocumentDetailPublicComponent } from '../folder-app/document-detail/document-detail-public/document-detail-public.component';
import { DocumentDetailComponent } from '../folder-app/document-detail/document-detail.component';
import { DetailFolderComponent } from '../folder-app/item-create/create-folder/detail-folder.component';

@NgModule({
    declarations: [
        DetailFolderComponent,
        DocumentDetailComponent,
        DocumentDetailPublicComponent
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
        DocumentDetailPublicComponent
    ]

})
export class SharedProjectModule { }
