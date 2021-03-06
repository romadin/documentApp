import { NgModule } from '@angular/core';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { SharedProjectModule } from '../construction-information-management-app/project-app/shared-project.module';
import { FolderDetailComponent } from '../construction-information-management-app/work-function-app/folder-detail/folder-detail.component';
import { ItemListComponent } from '../construction-information-management-app/work-function-app/item-list/item-list.component';
import { ItemReadComponent } from '../construction-information-management-app/work-function-app/item-read/item-read.component';
import {
    ItemsOverviewComponent
} from '../construction-information-management-app/work-function-app/items-overview/items-overview.component';
import { PartnersComponent } from '../construction-information-management-app/work-function-app/partners/partners.component';
import { SharedModule } from './shared.module';

@NgModule({
    declarations: [
        ItemsOverviewComponent,
        ItemListComponent,
        ItemReadComponent,
        PartnersComponent,
        FolderDetailComponent,
    ],
    exports: [
        ItemsOverviewComponent,
        ItemListComponent,
        ItemReadComponent,
        PartnersComponent,
        FolderDetailComponent,
    ],
    imports: [
        SharedModule,
        AngularEditorModule,
        SharedProjectModule,
    ]
})
export class SharedWorkFunctionModule {}
