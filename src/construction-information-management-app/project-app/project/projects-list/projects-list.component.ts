import { Component, OnInit } from '@angular/core';
import { ProjectService } from '../../../../shared/packages/project-package/project.service';
import { Project } from '../../../../shared/packages/project-package/project.model';
import { ActivatedRoute } from '@angular/router';
import { Organisation } from '../../../../shared/packages/organisation-package/organisation.model';
import { LoadingService } from '../../../../shared/loading.service';
import { HeaderWithFolderCommunicationService } from '../../../../shared/service/communication/HeaderWithFolder.communication.service';
import {
    animateChild,
    query,
    stagger, style,
    transition,
    trigger, useAnimation
} from '@angular/animations';
import { initialAnimation, scaleDownAnimation } from '../../../../shared/animations';

@Component({
    selector: 'cim-projecten',
    templateUrl: './projects-list.component.html',
    styleUrls: ['./projects-list.component.css'],
    animations: [
        trigger('pageAnimations', [
            transition('void => *', [
                query('@items', stagger(250, animateChild()), { optional: true })
            ]),
        ]),
        trigger('items', [
            transition('void => *', [
                useAnimation(initialAnimation)
            ]),
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
        this.projectService.getProjects(organisation).subscribe((projects: Project[]) => {
            !this.projects ? this.projects = projects : this.changeList(projects);
        });
        this.headerCommunicationService.headerTitle.next('Projecten');
    }

    private changeList(newProjects): void {
        if (newProjects.length > this.projects.length) {
            // project has been added
            this.editArray(newProjects, this.projects, 'add');
        } else if (newProjects.length < this.projects.length) {
            // project has been removed
            this.editArray(this.projects, newProjects, 'delete');
        }
    }

    private editArray(mainArray: Project[], subArray: Project[], method: 'delete' | 'add' ) {
        mainArray.forEach((mainProject: Project, i: number) => {
            if (subArray.length === 0 ) {
                method === 'add' ? this.projects.push(mainProject) : this.projects.splice(i, 1);
            } else {
                for (let index = 0; index < subArray.length; index++) {
                    const subProject = subArray[index];
                    if (mainProject.id === subProject.id) {
                        break;
                    } else if (index + 1 === subArray.length) {
                        method === 'add' ? this.projects.push(mainProject) : this.projects.splice(i, 1);
                    }
                }
            }
        });
    }
}
