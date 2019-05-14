import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { TemplatesOverviewComponent } from './templates-overview/templates-overview.component';
import { TemplatesListComponent } from './templates-overview/templates-list/templates-list.component';
import { TemplateComponent } from './template/template.component';
import { ItemDetailComponent } from './template/item-detail/item-detail.component';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { AddTemplatePopupComponent } from './popup/add-template-popup/add-template-popup.component';
import { TemplateEditComponent } from './templates-overview/template-edit/template-edit.component';

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
        ItemDetailComponent,
        AddTemplatePopupComponent,
        TemplateEditComponent
    ],
    imports: [
        SharedModule,
        RouterModule.forChild(routes),
        AngularEditorModule,
    ],
    entryComponents: [
        AddTemplatePopupComponent
    ]
})
export class TemplatesModule { }
