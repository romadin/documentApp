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
    stagger,
    transition,
    trigger, useAnimation
} from '@angular/animations';
import { initialAnimation, scaleDownAnimation } from '../../../../shared/animations';
import { editArray } from '../../../../shared/helpers/global-functions';

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
            if (this.projects.length === 0 ) {
                this.projects.push(newProjects[0]);
                return;
            }

            this.projects.push(editArray(newProjects, this.projects, 'add'));
        } else if (newProjects.length < this.projects.length) {
            // project has been removed
            if (newProjects.length === 0 ) {
               this.projects.splice(0, 1);
               return;
            }

            this.projects.splice(editArray(this.projects, newProjects, 'delete'), 1);
        }
    }
}
