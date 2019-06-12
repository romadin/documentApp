import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { CanActivateLoggedIn } from '../../../../can-activate/CanActivateLoggedIn';
import { SharedProjectModule } from '../../shared-project.module';
import { ProjectDetailComponent } from './project-detail.component';
import { SharedModule } from '../../../../shared/shared.module';
import { ProjectWorkFunctionComponent } from './project-work-function/project-work-function.component';

const routes: Routes = [
    { path: '', component: ProjectDetailComponent, canActivate: [ CanActivateLoggedIn ] },
];


@NgModule({
    imports: [
        SharedModule,
        SharedProjectModule,
        RouterModule.forChild(routes),
    ],
    declarations: [
        ProjectDetailComponent,
        ProjectWorkFunctionComponent,
    ],
    exports: [RouterModule]
})

export class ProjectDetailModule {}
