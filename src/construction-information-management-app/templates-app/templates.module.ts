import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { TemplatesOverviewComponent } from './templates-overview/templates-overview.component';
import { TemplatesListComponent } from './templates-overview/templates-list/templates-list.component';
import { TemplateComponent } from './template/template.component';
import { ItemDetailComponent } from './template/item-detail/item-detail.component';
import { AngularEditorModule } from '@kolkov/angular-editor';

const routes: Routes = [
    {
        path: '',
        component: TemplatesOverviewComponent,
    }
];

@NgModule({
    declarations: [
        TemplatesOverviewComponent,
        TemplatesListComponent,
        TemplateComponent,
        ItemDetailComponent
    ],
    imports: [
        SharedModule,
        RouterModule.forChild(routes),
        AngularEditorModule,
    ]
})
export class TemplatesModule { }
