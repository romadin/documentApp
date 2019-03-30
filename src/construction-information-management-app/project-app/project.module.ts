import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CanActivateLoggedIn } from '../../can-activate/CanActivateLoggedIn';
import { ProjectComponent } from './project/project.component';
import { ProjectsListComponent } from './project/projects-list/projects-list.component';
import { SharedModule } from '../../shared/shared.module';
import { ProjectRowComponent } from './project/projects-list/project-row/project-row.component';

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
                path: 'folder/:id',
                loadChildren: '../folder-app/folder.module#FolderModule',
                canActivate: [ CanActivateLoggedIn ]
            },
            {
                path: 'acties',
                loadChildren: '../action-list-app/action-list.module#ActionListModule',
                canActivate: [ CanActivateLoggedIn ]
            },
            {
                path: 'agenda',
                loadChildren: '../'
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