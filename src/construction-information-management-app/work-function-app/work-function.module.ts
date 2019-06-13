import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AngularEditorModule } from '@kolkov/angular-editor';

import { SharedProjectModule } from '../project-app/shared-project.module';
import { WorkFunctionComponent } from './work-function.component';
import { SharedModule } from '../../shared/shared.module';
import { ItemListComponent } from './item-list/item-list.component';
import { ItemCreateComponent } from './item-create/item-create.component';
import { ItemReadComponent } from './item-read/item-read.component';
import { CreateDocumentComponent } from './item-create/create-document/create-document.component';
import { PartnersComponent } from './partners/partners.component';
import { FolderDetailComponent } from './folder-detail/folder-detail.component';

const routes: Routes = [
    {
        path: '',
        component: WorkFunctionComponent
    }
];

@NgModule({
    imports: [
        AngularEditorModule,
        SharedModule,
        SharedProjectModule,
        RouterModule.forChild( routes )
    ],
    declarations: [
        WorkFunctionComponent,
        CreateDocumentComponent,
        ItemListComponent,
        ItemCreateComponent,
        ItemReadComponent,
        PartnersComponent,
        FolderDetailComponent,
    ],
})

export class WorkFunctionModule { }
