import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { CanActivateLoggedIn } from '../../../../can-activate/CanActivateLoggedIn';
import { ProjectDetailComponent } from './project-detail.component';
import { SharedModule } from '../../../../shared/shared.module';
import { ProjectWorkFunctionEditComponent } from './project-work-function-edit/project-work-function-edit.component';

const routes: Routes = [
    { path: '', component: ProjectDetailComponent, canActivate: [ CanActivateLoggedIn ] },
];


@NgModule({
    imports: [
        SharedModule,
        RouterModule.forChild(routes),
    ],
    declarations: [
        ProjectDetailComponent,
        ProjectWorkFunctionEditComponent,
    ],
    exports: [RouterModule]
})

export class ProjectDetailModule {}
