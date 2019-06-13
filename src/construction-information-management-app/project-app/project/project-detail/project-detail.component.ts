import { animate, keyframes, state, style, transition, trigger } from '@angular/animations';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Project } from '../../../../shared/packages/project-package/project.model';

import { UserService } from '../../../../shared/packages/user-package/user.service';
import { User } from '../../../../shared/packages/user-package/user.model';
import { WorkFunction } from '../../../../shared/packages/work-function-package/work-function.model';
import { WorkFunctionService } from '../../../../shared/packages/work-function-package/work-function.service';
import { Organisation } from '../../../../shared/packages/organisation-package/organisation.model';
import { ProjectService } from '../../../../shared/packages/project-package/project.service';
import { ProjectCommunicationService } from '../../../../shared/service/communication/project.communication.service';
import { RouterService } from '../../../../shared/service/router.service';

@Component({
    selector: 'cim-project-detail',
    templateUrl: './project-detail.component.html',
    styleUrls: ['./project-detail.component.css'],
    animations: [
        trigger('toggleInView', [
            state('close', style({
                transform: 'translateX(110%)'
            })),
            state('open', style({
                width: '48%',
                transform: 'translateX(0)'
            })),
            transition('close => open', [
                animate('300ms cubic-bezier(0.0, 0.0, 0.2, 1)')
            ]),
            transition('open => close', [
                animate('300ms cubic-bezier(0.0, 0.0, 0.2, 1)', keyframes([
                    style({ transform: 'translateX(5%)', offset: 0.1}),
                    style({ transform: 'translateX(10%)', offset: 0.8}),
                    style({ transform: 'translateX(110%)', offset: 1}),
                ]))
            ]),
            transition('void => *', [
                style({ opacity: '0'}),
                animate('100ms cubic-bezier(0.0, 0.0, 0.2, 1)', style({ opacity: '1'})),
            ]),
            transition('* => void', [
                animate('100ms cubic-bezier(0.0, 0.0, 0.2, 1)', keyframes([
                    style({ opacity: '0'})
                ])),
            ])
        ]),
        trigger('resizeWidth', [
            state('fullWidth', style({
                width: '100%'
            })),
            state('smallWidth', style({
                width: '50%'
            })),
            transition('fullWidth <=> smallWidth', [
                animate('350ms cubic-bezier(0.0, 0.0, 0.2, 1)')
            ]),
        ])
    ]
})

export class ProjectDetailComponent implements OnInit, OnDestroy {
    workFunctions: WorkFunction[];
    currentUser: User;
    folderUrlToRedirect: string;
    project: Project;
    showFunctionDetail = false;

    constructor(private activatedRoute: ActivatedRoute,
                private workFunctionService: WorkFunctionService,
                private userService: UserService,
                private projectService: ProjectService,
                private routerService: RouterService,
                private communicationService: ProjectCommunicationService) {
        this.folderUrlToRedirect = 'workFunction/';
    }

    ngOnInit() {
        this.routerService.setBackRoute('/projecten');
        const projectId = parseInt(this.activatedRoute.snapshot.paramMap.get('id'), 10);
        this.userService.getCurrentUser().subscribe((user: User) => {
            this.currentUser = user;
        });

        this.projectService.getProject(projectId, <Organisation>this.activatedRoute.snapshot.data.organisation).then(project => {
            this.project = project;
            this.workFunctionService.getWorkFunctionsByParent({projectId: projectId}, project).subscribe(workFunction => {
                workFunction = workFunction.sort((a, b) => a.order - b.order);
                this.workFunctions = workFunction;
            });
        });

        this.communicationService.triggerAddWorkFunction.subscribe(show => {
            this.showFunctionDetail = show;
        });
    }

    ngOnDestroy() {
        this.communicationService.triggerAddWorkFunction.next(false);
    }
    onCloseItemView() {
        this.showFunctionDetail = false;
        this.communicationService.triggerAddWorkFunction.next(false);
    }
    onWorkFunctionAdded(workFunction: WorkFunction): void {
        this.workFunctions.push(workFunction);
    }
}
