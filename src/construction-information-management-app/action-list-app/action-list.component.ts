import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute,  } from '@angular/router';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTable } from '@angular/material';
import { trigger, style, animate, transition, keyframes } from '@angular/animations';
import { Subscription } from 'rxjs';

import { ActionService } from '../../shared/packages/action-package/action.service';
import { Action } from '../../shared/packages/action-package/action.model';
import { ApiActionEditPostData } from '../../shared/packages/action-package/api-action.interface';
import { RouterService } from '../../shared/service/router.service';
import { ActionCommunicationService } from '../../shared/packages/communication/action.communication.service';
import { ToastService } from '../../shared/toast.service';
import { LoadingService } from '../../shared/loading.service';

@Component({
    selector: 'cim-action-list',
    templateUrl: './action-list.component.html',
    styleUrls: ['./action-list.component.css'],
    animations: [
        trigger('toggleInView', [
            transition('void => *', [
                style({ transform: 'translateX(110%)', }),
                animate('250ms', style({ transform: 'translateX(0)' })),
            ]),
            transition('* => void', [
                animate('250ms', keyframes([
                    style({ transform: 'translateX(110%)' })
                ])),
            ])
        ]),
    ]
})
export class ActionListComponent implements OnInit, OnDestroy {
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
    private subscriptions: Subscription[] = [];

    constructor(private actionService: ActionService,
                private activatedRoute: ActivatedRoute,
                private routerService: RouterService,
                private toastService: ToastService,
                private actionCommunication: ActionCommunicationService,
                private loadingService: LoadingService
               ) {
    }
    ngOnInit() {
        this.projectId = parseInt(this.activatedRoute.snapshot.paramMap.get('id'), 10);
        this.loadingService.isLoading.next(true);
        this.actionService.getActionsByProject(this.projectId).subscribe((actions) => {
            this.loadingService.isLoading.next(false);
            if (this.actions && this.actions.length > 0 && this.table) {
                this.table.renderRows();
            }
            this.actions = actions.map(action => action);

            // remove the already done actions and set in separate array.
            this.setActionsDone();
        });

        this.subscriptions.push(this.actionCommunication.triggerAddAction.subscribe((addAction: boolean) => {
            if ( !this.showItemDetail || this.actionToEdit !== null) {
                this.resetRightSide();
                this.rightSideView = addAction;
                setTimeout(() => { this.actionToEdit = null; this.showItemDetail = addAction; }, 250);
            }
        }));

        this.subscriptions.push(this.actionCommunication.showArchivedActions.subscribe((show: boolean) => {
            this.resetRightSide();
            this.rightSideView = show;
            setTimeout(() => { this.showArchivedActions = show; }, 250);
        }));

        this.routerService.setBackRouteParentFromActivatedRoute(this.activatedRoute.parent);
    }

    ngOnDestroy() {
        this.actionCommunication.triggerAddAction.next(false);
        this.actionCommunication.showArchivedActions.next(false);
        this.subscriptions.forEach((subscription) => subscription.unsubscribe());
        this.resetRightSide();
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
            this.toastService.showSuccess('Actie: ' + actionEdited.code + ' is gearchiveerd', 'Gearchiveerd');
            this.actionCommunication.showArchivedActionsButton.next(this.actionsDone.length > 0);
        }, 500);
    }

    private resetRightSide(): void {
        this.actionToEdit = undefined;
        this.showItemDetail = false;
        this.showArchivedActions = false;
    }

    /**
     * Set all the actions that are done in a separate array, so we can send it to the archive component.
     */
    private setActionsDone(): void {
        this.actionsDone = this.actions.filter(action => action.isDone === true);
        this.actionsDone.forEach((actionDone) => {
            this.actions.splice(this.actions.findIndex(action => action === actionDone), 1);
        });
        this.actionCommunication.showArchivedActionsButton.next(this.actionsDone.length > 0);
    }
}
