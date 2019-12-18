import {
    animate, animateChild,
    keyframes,
    query,
    stagger,
    state,
    style,
    transition,
    trigger,
    useAnimation
} from '@angular/animations';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Project } from '../../../../shared/packages/project-package/project.model';

import { UserService } from '../../../../shared/packages/user-package/user.service';
import { User } from '../../../../shared/packages/user-package/user.model';
import { WorkFunction } from '../../../../shared/packages/work-function-package/work-function.model';
import { WorkFunctionService } from '../../../../shared/packages/work-function-package/work-function.service';
import { Organisation } from '../../../../shared/packages/organisation-package/organisation.model';
import { ProjectService } from '../../../../shared/packages/project-package/project.service';
import { HeaderWithFolderCommunicationService } from '../../../../shared/service/communication/HeaderWithFolder.communication.service';
import { ProjectCommunicationService } from '../../../../shared/service/communication/project.communication.service';
import { RouterService } from '../../../../shared/service/router.service';
import { initialAnimation, scaleDownAnimation } from '../../../../shared/animations';

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

export class ProjectDetailComponent implements OnInit, OnDestroy {
    currentUser: User;
    folderUrlToRedirect: string;
    project: Project;
    showFunctionDetail = false;
    workFunctionToEdit: WorkFunction;
    workFunctions: WorkFunction[];

    constructor(private activatedRoute: ActivatedRoute,
                private workFunctionService: WorkFunctionService,
                private userService: UserService,
                private projectService: ProjectService,
                private routerService: RouterService,
                private communicationService: ProjectCommunicationService,
                private headerCommunicationService: HeaderWithFolderCommunicationService) {
        this.folderUrlToRedirect = 'workFunction/';
    }

    ngOnInit() {
        this.routerService.setBackRoute('/projecten');
        this.project = this.activatedRoute.parent.parent.snapshot.data.project;
        this.userService.getCurrentUser().subscribe((user: User) => {
            this.currentUser = user;
        });

        this.headerCommunicationService.headerTitle.next(this.project.name);

        this.communicationService.triggerAddWorkFunction.subscribe(show => {
            this.showFunctionDetail = show;
        });
    
        this.project.workFunctions.subscribe((workFunctions: WorkFunction[]) => {
            if (!this.workFunctions) {
                this.workFunctions = workFunctions;
            } else {
                this.changeList(workFunctions);
            }
        });
    }

    ngOnDestroy() {
        this.communicationService.triggerAddWorkFunction.next(false);
    }
    onCloseItemView() {
        this.showFunctionDetail = false;
        this.communicationService.triggerAddWorkFunction.next(false);
    }
    onEditWorkFunction(workFunction: WorkFunction) {
        this.onCloseItemView();
        setTimeout(() => {
            this.showFunctionDetail = true;
            this.workFunctionToEdit = workFunction;
        }, 290);
    }
    
    private changeList(newWorkFunctions): void {
        if (newWorkFunctions.length > this.workFunctions.length) {
            // project has been added
            this.editArray(newWorkFunctions, this.workFunctions, 'add');
        } else if (newWorkFunctions.length < this.workFunctions.length) {
            // project has been removed
            this.editArray(this.workFunctions, newWorkFunctions, 'delete');
        }
    }
    
    private editArray(mainArray: WorkFunction[], subArray: WorkFunction[], method: 'delete' | 'add' ) {
        mainArray.forEach((newWorkFunction: WorkFunction, i: number) => {
            for (let index = 0; index < subArray.length; index++) {
                const oldProject = this.workFunctions[index];
                if (newWorkFunction.id === oldProject.id) {
                    break;
                } else if (index + 1 === subArray.length) {
                    method === 'add' ? this.workFunctions.push(newWorkFunction) : this.workFunctions.splice(i, 1);
                }
            }
        });
    }
}
