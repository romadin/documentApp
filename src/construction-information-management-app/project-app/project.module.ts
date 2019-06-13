import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CanActivateLoggedIn } from '../../can-activate/CanActivateLoggedIn';
import { ProjectComponent } from './project/project.component';
import { ProjectsListComponent } from './project/projects-list/projects-list.component';
import { SharedModule } from '../../shared/shared.module';
import { ProjectRowComponent } from './project/projects-list/project-row/project-row.component';
import { OrganisationResolver } from '../../shared/packages/organisation-package/organisation.resolver';

const routes: Routes = [
    {
        path: '',
        component: ProjectsListComponent
    },
    {
        path: ':id',
        component: ProjectComponent,
        children: [
            {
                path: 'functies/:id',
                loadChildren: '../work-function-app/work-function.module#WorkFunctionModule',
                canActivate: [ CanActivateLoggedIn ],
                resolve: { organisation: OrganisationResolver }
            },
            {
                path: 'acties',
                loadChildren: '../action-list-app/action-list.module#ActionListModule',
                canActivate: [ CanActivateLoggedIn ],
                resolve: { organisation: OrganisationResolver }
            },
            {
                path: 'agenda',
                loadChildren: '../agenda-app/agenda.module#AgendaModule',
                canActivate: [ CanActivateLoggedIn ]
            },
            {
                path: '',
                loadChildren: './project/project-detail/project-detail.module#ProjectDetailModule',
                canActivate: [ CanActivateLoggedIn ]
            }
        ],
        canActivate: [ CanActivateLoggedIn ],
    },
];


@NgModule({
    imports: [
        SharedModule,
        RouterModule.forChild(routes),
    ],
    declarations: [
        ProjectsListComponent,
        ProjectComponent,
        ProjectRowComponent,
    ],
    exports: [RouterModule]
})

export class ProjectModule {}
