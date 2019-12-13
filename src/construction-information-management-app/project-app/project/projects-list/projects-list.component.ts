import { AfterContentInit, AfterViewInit, Component, OnInit } from '@angular/core';
import { ProjectService } from '../../../../shared/packages/project-package/project.service';
import { Project } from '../../../../shared/packages/project-package/project.model';
import { ActivatedRoute } from '@angular/router';
import { Organisation } from '../../../../shared/packages/organisation-package/organisation.model';
import { LoadingService } from '../../../../shared/loading.service';
import { HeaderWithFolderCommunicationService } from '../../../../shared/service/communication/HeaderWithFolder.communication.service';
import {
    animate,
    animateChild,
    query,
    stagger, state, style,
    transition,
    trigger, useAnimation
} from '@angular/animations';
import { initialAnimation, scaleDownAnimation } from '../../../../shared/animations';
import { Observable, Subject } from 'rxjs';
import { take } from 'rxjs/operators';

@Component({
    selector: 'cim-projecten',
    templateUrl: './projects-list.component.html',
    styleUrls: ['./projects-list.component.css'],
    animations: [
        trigger('pageAnimations', [
            transition('* <=> *', [
                query(
                    ':enter',
                    [
                        style({ opacity: 0 }),
                        stagger(250, useAnimation(initialAnimation)),
                    ],
                    { optional: true }
                ),
            ]),
        ]),
        trigger('items', [
            transition('* => void', [
                useAnimation(scaleDownAnimation)
            ])
        ])
    ]
})
export class ProjectsListComponent implements OnInit {
    projects: Project[];

    constructor(
        private projectService: ProjectService,
        private activatedRoute: ActivatedRoute,
        private loadingService: LoadingService,
        private headerCommunicationService: HeaderWithFolderCommunicationService
    ) {
    }

    ngOnInit() {
        const organisation = <Organisation>this.activatedRoute.snapshot.data.organisation;
        this.projectService.getProjectsCache(organisation).subscribe((projects: Project[]) => {
            if (!this.projects) {
                this.projects = projects;
            } else {
                projects.map((project) => project['isNew'] = true);
                this.changeList(projects);
            }
            
        });
        this.headerCommunicationService.headerTitle.next('Projecten');
    }

    private changeList(newProjects): void {
        newProjects.forEach((newProject: Project) => {
            for (let index = 0; index < this.projects.length; index++) {
                const oldProject = this.projects[index];
                if (newProject.id === oldProject.id) {
                    break;
                } else if (index + 1 === this.projects.length) {
                    this.projects.push(newProject);
                }
            }
        });
    }
}
