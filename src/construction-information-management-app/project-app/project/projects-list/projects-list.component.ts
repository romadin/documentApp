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
import { RouterService } from '../../../../shared/service/router.service';
import { DefaultPopupData, ProjectPopupComponent } from '../../../popups/project-popup/project-popup.component';
import { MatDialog } from '@angular/material/dialog';
import { MenuAction } from '../../../header/header.component';

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
    private organisation: Organisation;

    constructor(
        public dialog: MatDialog,
        private projectService: ProjectService,
        private activatedRoute: ActivatedRoute,
        private loadingService: LoadingService,
        private headerCommunicationService: HeaderWithFolderCommunicationService,
        private routerService: RouterService,
    ) {
    }

    ngOnInit() {
        const action: MenuAction = {
            onClick: this.addProject.bind(this),
            iconName: 'add',
            name: 'Project toevoegen',
            show: false,
            needsAdmin: true,
            urlGroup: ['/projecten'],
        };
        this.organisation = <Organisation>this.activatedRoute.snapshot.data.organisation;
        this.projectService.getProjects(this.organisation).subscribe((projects: Project[]) => {
            !this.projects ? this.projects = projects : this.changeList(projects);
            this.routerService.setHeaderAction(this.organisation.isDemo && projects.length > 0 ? [] : [action]);
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

    private addProject(): void {
        const data: DefaultPopupData =  {
            title: 'Voeg een project toe',
            placeholder: 'Project naam',
            submitButton: 'Voeg toe',
            organisation: this.organisation
        };
        this.dialog.open(ProjectPopupComponent, {
            width: '400px',
            data: data,
        });
    }
}
