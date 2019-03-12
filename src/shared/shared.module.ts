import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MaterialModule } from './material.module';
import { HttpClientModule } from '@angular/common/http';
import { FolderRowComponent } from '../construction-information-management-app/folder-app/folder-row/folder-row.component';
import { DocumentRowComponent } from '../construction-information-management-app/folder-app/document-row/document-row.component';

@NgModule({
    declarations: [
        FolderRowComponent,
        DocumentRowComponent,
    ],
    exports: [
        ReactiveFormsModule,
        FormsModule,
        MaterialModule,
        HttpClientModule,
        FolderRowComponent,
        DocumentRowComponent,
        CommonModule,
    ],
    imports: [
        CommonModule,
        MaterialModule,
    ]
})

export class SharedModule { }
