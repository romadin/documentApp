import { NgModule } from '@angular/core';
import { ActivatedRoute, RouterModule, Routes } from '@angular/router';

import { CanActivateLoggedIn } from '../../can-activate/CanActivateLoggedIn';
import { getBreadcrumbNameProject } from '../../shared/helpers/practical-functions';
import { ProjectResolver } from '../../shared/packages/project-package/project.resolver';
import { ProjectRouterComponent } from './project-router/project-router.component';
import { ProjectComponent } from './project/project.component';
import { ProjectsListComponent } from './project/projects-list/projects-list.component';
import { SharedModule } from '../../shared/shared.module';
import { ProjectRowComponent } from './project/projects-list/project-row/project-row.component';
import { OrganisationResolver } from '../../shared/packages/organisation-package/organisation.resolver';

const routes: Routes = [
    {
        path: '',
        component: ProjectRouterComponent,
        data: { breadcrumb: 'Projecten' },
        children: [
            {
                path: ':id',
                resolve: { project: ProjectResolver },
                component: ProjectComponent,
                canActivate: [ CanActivateLoggedIn ],
                data: { breadcrumb: getBreadcrumbNameProject  },
                children: [
                    {
                        path: 'functies',
                        loadChildren: '../work-function-app/work-function.module#WorkFunctionModule',
                        canActivate: [ CanActivateLoggedIn ],
                        resolve: { organisation: OrganisationResolver },
                        data: { breadcrumb: 'Functies' },
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
            },
            {
                path: '',
                component: ProjectsListComponent,
                canActivate: [ CanActivateLoggedIn ],
            }
        ]
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
        ProjectRouterComponent
    ],
    exports: [RouterModule]
})

export class ProjectModule {}
