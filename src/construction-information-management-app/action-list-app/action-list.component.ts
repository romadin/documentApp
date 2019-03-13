import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ActivatedRoute,  } from '@angular/router';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTable } from '@angular/material';
import { trigger, style, animate, transition, keyframes } from '@angular/animations';
import { ToastrManager } from 'ng6-toastr-notifications';

import { ActionService } from '../../shared/packages/action-package/action.service';
import { Action } from '../../shared/packages/action-package/action.model';
import { ApiActionEditPostData } from '../../shared/packages/action-package/api-action.interface';
import { RouterService } from '../../shared/service/router.service';
import { ActionCommunicationService } from '../../shared/packages/communication/action.communication.service';
import { ToastrOptions } from 'ng6-toastr-notifications/lib/toastr.options';

@Component({
    selector: 'cim-action-list',
    templateUrl: './action-list.component.html',
    styleUrls: ['./action-list.component.css'],
    animations: [
        trigger('toggleInView', [
            transition('void => *', [
                style({ transform: 'translateX(110%)', }),
                animate('500ms 300ms', style({ transform: 'translateX(0)' })),
            ]),
            transition('* => void', [
                animate('300ms', keyframes([
                    style({ transform: 'translateX(110%)' })
                ])),
            ])
        ]),
    ]
})
export class ActionListComponent implements OnInit {
    @ViewChild(MatTable) table: MatTable<any>;
    public actions: Action[];
    public actionsDone: Action[] = [];
    public actionToEdit: Action;
    public rightSideView = false;
    public showItemDetail = false;
    public showArchivedActions = false;
    public projectId: number;
    public displayedColumns: string[] = ['code', 'description', 'actionHolder', 'week', 'status', 'comment'];
    public selection = new SelectionModel<Action>(true, []);

    private timerId: number;
    private toastOption = {
        position: 'top-center',
        toastTimeout: 3000,
        newestOnTop: true,
        maxShown: 3,
        animate: 'slideFromTop',
        messageClass: 'toastWrapper',
        enableHTML: false,
        showCloseButton: false,
    };

    constructor(private actionService: ActionService,
                private activatedRoute: ActivatedRoute,
                private routerService: RouterService,
                private actionCommunication: ActionCommunicationService,
                private toastMessage: ToastrManager) {
    }
    ngOnInit() {
        this.projectId = parseInt(this.activatedRoute.snapshot.paramMap.get('id'), 10);
        this.actionService.getActionsByProject(this.projectId).subscribe((actions) => {
            if (actions.length > 0 && this.table) {
                this.table.renderRows();
            }
            this.actions = actions;

            // remove the already done actions and set in separate array.
            this.actionsDone = this.actions.filter(action => action.isDone === true);
            this.actionsDone.forEach((actionDone) => {
                this.actions.splice(this.actions.findIndex(action => action === actionDone), 1);
            });
        });

        this.actionCommunication.triggerAddAction.subscribe((addAction: boolean) => {
            if ( !this.showItemDetail || this.actionToEdit !== null) {
                this.resetRightSide();
                this.rightSideView = addAction;
                setTimeout(() => { this.actionToEdit = null; this.showItemDetail = addAction; }, 300);
            }
        });

        this.actionCommunication.showArchivedActions.subscribe((show: boolean) => {
            this.resetRightSide();
            this.rightSideView = show;
            setTimeout(() => { this.showArchivedActions = show; }, 300);
        });

        this.routerService.setBackRouteParentFromActivatedRoute(this.activatedRoute.parent);
    }

    editItem(event: MouseEvent, action: Action): void {
        event.stopPropagation();
        this.resetRightSide();
        this.actionToEdit = action;
        this.showItemDetail = true;
        this.rightSideView = true;
    }

    OnCloseDetail(closeEdit: boolean): void {
        this.resetRightSide();
        this.rightSideView = false;
    }

    addActionFromArchive(archivedAction: Action): void {
        this.actions.push(archivedAction);
        this.table.renderRows();
    }

    changeActionStatus(e: MouseEvent, actionEdited: Action): void {
        e.preventDefault();
        e.stopPropagation();
        if (this.timerId) {
            clearTimeout(this.timerId);
        }
        const actionsDoneContainer = this.actionsDone.map(action => action);
        this.timerId = setTimeout(() => {
            actionEdited.isDone = !actionEdited.isDone;
            const postData: ApiActionEditPostData  = {
                isDone: actionEdited.isDone
            };

            this.actionService.editAction(actionEdited, postData);
            this.actions.splice(this.actions.findIndex(action => action === actionEdited), 1);
            actionsDoneContainer.push(actionEdited);
            this.actionsDone = actionsDoneContainer;

            this.table.renderRows();
            this.toastMessage.successToastr('Actie: ' + actionEdited.code + ' is gearchiveerd', 'Gearchiveerd', this.toastOption);
        }, 500);
    }

    private resetRightSide(): void {
        this.actionToEdit = undefined;
        this.showItemDetail = false;
        this.showArchivedActions = false;
    }
}
