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
import { ItemsOverviewComponent } from '../work-function-app/items-overview/items-overview.component';
import { SharedWorkFunctionModule } from '../../shared/shared-work-function.module';
import { WorkFunctionPackageResolverService } from '../work-function-app/work-function-package-resolver.service';

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
                data: { breadcrumb: getBreadcrumbNameProject  },
                children: [
                    {
                        path: 'bim-uitvoeringsplan/:id',
                        component: ItemsOverviewComponent,
                        resolve: { organisation: OrganisationResolver, parent: WorkFunctionPackageResolverService },
                        data: { breadcrumb: 'BIM-uitvoeringsplan' },
                    },
                    {
                        path: 'functies',
                        loadChildren: '../work-function-app/work-function.module#WorkFunctionModule',
                        resolve: { organisation: OrganisationResolver },
                        data: { breadcrumb: 'Functies' },
                    },
                    {
                        path: 'acties',
                        loadChildren: '../action-list-app/action-list.module#ActionListModule',
                        resolve: { organisation: OrganisationResolver }
                    },
                    {
                        path: 'agenda',
                        loadChildren: '../agenda-app/agenda.module#AgendaModule',
                    },
                    {
                        path: '',
                        loadChildren: './project/project-detail/project-detail.module#ProjectDetailModule',
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
        SharedWorkFunctionModule,
        RouterModule.forChild(routes),
    ],
    declarations: [
        ProjectsListComponent,
        ProjectComponent,
        ProjectRowComponent,
        ProjectRouterComponent,
    ],
    exports: [RouterModule]
})

export class ProjectModule {}
