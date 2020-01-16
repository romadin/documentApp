import { Component, OnDestroy, OnInit } from '@angular/core';
import { User } from '../../../shared/packages/user-package/user.model';
import { Project } from '../../../shared/packages/project-package/project.model';
import { WorkFunction } from '../../../shared/packages/work-function-package/work-function.model';
import { ActivatedRoute } from '@angular/router';
import { WorkFunctionService } from '../../../shared/packages/work-function-package/work-function.service';
import { UserService } from '../../../shared/packages/user-package/user.service';
import { ProjectService } from '../../../shared/packages/project-package/project.service';
import { RouterService } from '../../../shared/service/router.service';
import { ProjectCommunicationService } from '../../../shared/service/communication/project.communication.service';
import { HeaderWithFolderCommunicationService } from '../../../shared/service/communication/HeaderWithFolder.communication.service';
import {
    animate, animateChild,
    query,
    stagger,
    state,
    style,
    transition,
    trigger,
    useAnimation
} from '@angular/animations';
import { initialAnimation, scaleDownAnimation } from '../../../shared/animations';
import { editArray } from '../../../shared/helpers/global-functions';

@Component({
    selector: 'app-work-function-list',
    templateUrl: './work-function-list.component.html',
    styleUrls: ['./work-function-list.component.css'],
    animations: [
        trigger('toggleInView', [
            state('close', style({
                width: '0',
                opacity: '0'
            })),
            state('open', style({
                width: '50%',
                opacity: '1'
            })),
            transition('close <=> open', [
                animate('300ms cubic-bezier(0.0, 0.0, 0.2, 1)')
            ]),
        ]),
        trigger('resizeWidth', [
            state('fullWidth', style({
                width: '100%'
            })),
            state('smallWidth', style({
                width: '50%'
            })),
            transition('fullWidth <=> smallWidth', [
                animate('300ms cubic-bezier(0.0, 0.0, 0.2, 1)')
            ]),
            transition('void => *', [
                query('@items', stagger(100, animateChild()), { optional: true })
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
export class WorkFunctionListComponent  implements OnInit, OnDestroy {
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
        this.project = this.activatedRoute.parent.parent.parent.snapshot.data.project;
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
            this.workFunctions.push(editArray(newWorkFunctions, this.workFunctions, 'add'));
        } else if (newWorkFunctions.length < this.workFunctions.length) {
            // project has been removed
            this.workFunctions.splice(editArray(this.workFunctions, newWorkFunctions, 'delete'), 1);
        }
    }
}
