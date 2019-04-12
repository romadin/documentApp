import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AngularEditorModule } from '@kolkov/angular-editor';

import { FolderComponent } from './folder.component';
import { SharedModule } from '../../shared/shared.module';
import { DocumentDetailComponent } from './document-detail/document-detail.component';
import { ItemListComponent } from './item-list/item-list.component';
import { ItemCreateComponent } from './item-create/item-create.component';
import { DetailFolderComponent } from './item-create/create-folder/detail-folder.component';
import { ItemReadComponent } from './item-read/item-read.component';
import { CreateDocumentComponent } from './item-create/create-document/create-document.component';
import { PartnersComponent } from './partners/partners.component';
import { FolderDetailComponent } from './folder-detail/folder-detail.component';

const routes: Routes = [
    {
        path: '',
        component: FolderComponent
    }
];

@NgModule({
    imports: [
        AngularEditorModule,
        SharedModule,
        RouterModule.forChild( routes )
    ],
    declarations: [
        FolderComponent,
        CreateDocumentComponent,
        DocumentDetailComponent,
        ItemListComponent,
        ItemCreateComponent,
        DetailFolderComponent,
        ItemReadComponent,
        PartnersComponent,
        FolderDetailComponent,
    ],
})

export class FolderModule { }
