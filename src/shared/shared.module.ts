import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { MaterialModule } from './material.module';

import { FolderRowComponent } from '../construction-information-management-app/folder-app/folder-row/folder-row.component';
import { DocumentRowComponent } from '../construction-information-management-app/folder-app/document-row/document-row.component';
import { UserRowComponent } from '../construction-information-management-app/user-app/users/user-row/user-row.component';
import { UserDetailComponent } from '../construction-information-management-app/user-app/users/user-detail/user-detail.component';
import { UserDetailPublicComponent } from '../construction-information-management-app/user-app/users/user-detail/user-detail-public/user-detail-public.component';

@NgModule({
    declarations: [
        FolderRowComponent,
        DocumentRowComponent,
        UserRowComponent,
        UserDetailComponent,
        UserDetailPublicComponent,
    ],
    exports: [
        ReactiveFormsModule,
        FormsModule,
        MaterialModule,
        HttpClientModule,
        FolderRowComponent,
        DocumentRowComponent,
        UserRowComponent,
        UserDetailComponent,
        UserDetailPublicComponent,
        CommonModule,
    ],
    imports: [
        CommonModule,
        MaterialModule,
        ReactiveFormsModule,
        FormsModule,
    ]
})

export class SharedModule { }
