import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { SharedProjectModule } from '../project-app/shared-project.module';
import { TemplatesOverviewComponent } from './templates-overview/templates-overview.component';
import { TemplatesListComponent } from './templates-overview/templates-list/templates-list.component';
import { TemplateComponent } from './template/template.component';
import { ChapterDetailComponent } from './template/chapter-detail/chapter-detail.component';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { AddTemplatePopupComponent } from './popup/add-template-popup/add-template-popup.component';
import { TemplateEditComponent } from './templates-overview/template-edit/template-edit.component';
import { ChapterComponent } from './template/chapter/chapter.component';
import { HeadlineDetailComponent } from './template/headline-detail/headline-detail.component';
import { HeadlineComponent } from './template/headline/headline.component';
import { ChapterEditComponent } from './template/chapter-detail/chapter-edit/chapter-edit.component';
import { ChapterListComponent } from './template/chapter-detail/chapter-list/chapter-list.component';
import { HeadlineEditComponent } from './template/headline-detail/headline-edit/headline-edit.component';
import { HeadlineListComponent } from './template/headline-detail/headline-list/headline-list.component';

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
        ChapterDetailComponent,
        AddTemplatePopupComponent,
        TemplateEditComponent,
        ChapterComponent,
        HeadlineDetailComponent,
        HeadlineComponent,
        ChapterEditComponent,
        ChapterListComponent,
        HeadlineEditComponent,
        HeadlineListComponent
    ],
    imports: [
        SharedModule,
        RouterModule.forChild(routes),
        AngularEditorModule,
        SharedProjectModule,
    ],
    entryComponents: [
        AddTemplatePopupComponent
    ]
})
export class TemplatesModule { }
