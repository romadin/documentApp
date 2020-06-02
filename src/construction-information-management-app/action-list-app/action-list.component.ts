import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute,  } from '@angular/router';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTable } from '@angular/material';
import { trigger, style, animate, transition, keyframes } from '@angular/animations';
import { Subscription } from 'rxjs';

import html2canvas from 'html2canvas';

import { ActionService } from '../../shared/packages/action-package/action.service';
import { Action } from '../../shared/packages/action-package/action.model';
import { ApiActionEditPostData } from '../../shared/packages/action-package/api-action.interface';
import { RouterService } from '../../shared/service/router.service';
import { ActionCommunicationService } from '../../shared/service/communication/action.communication.service';
import { ToastService } from '../../shared/toast.service';
import { LoadingService } from '../../shared/loading.service';
import { Organisation } from '../../shared/packages/organisation-package/organisation.model';

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
    @ViewChild('list') list: ElementRef;
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
    private organisation: Organisation;

    constructor(private actionService: ActionService,
                private activatedRoute: ActivatedRoute,
                private routerService: RouterService,
                private toastService: ToastService,
                private actionCommunication: ActionCommunicationService,
                private loadingService: LoadingService
               ) {
    }
    ngOnInit() {
        this.projectId = parseInt(this.activatedRoute.parent.parent.snapshot.paramMap.get('id'), 10);
        this.organisation = this.activatedRoute.parent.snapshot.data.organisation;
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

        this.subscriptions.push(this.actionCommunication.exportToPdf.subscribe(exportToPdf => {
            if (exportToPdf) {
                this.exportActionListToPdf();
            }
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

    private exportActionListToPdf(): void {
        const pdfName = 'aktie lijst.pdf';

        this.actionService.createActionPDF(this.convertActionsToPlainHtmlString(), this.organisation, pdfName).subscribe((blob) => {
            const file = new Blob([blob], {type: 'application/pdf'});
            if (window.navigator.msSaveOrOpenBlob) {
                // IE10+
                window.navigator.msSaveOrOpenBlob(file, 'BIM-uitvoeringsplan');
            } else { // Others
                // create e temporary a href element so we can fake the download click.
                const a = document.createElement('a');
                const url = URL.createObjectURL(file);
                a.href = url;
                a.download = pdfName;
                document.body.appendChild(a);
                a.click();
                setTimeout(function() {
                    // remove the a href element.
                    document.body.removeChild(a);
                    window.URL.revokeObjectURL(url);
                }, 0);
            }
        });
    }

    /**
     * We converting the actions to plain html so that we can make an pdf export from it.
     */
    private convertActionsToPlainHtmlString(): string {
        let html = '<h1> Acties </h1> <table border="1" cellpadding="5">';

        html += `<tr align="center" style="font-weight: bold;">
                    <th>Actie code</th> <th>Omschrijving</th> <th>Actie houder</th> <th>Week</th> <th>Klaar</th> <th>Opmerking</th>
                </tr>`;

        this.actions.forEach((action) => {
            html += `<tr ><td>${action.code}</td>
                     <td>${action.description}</td>
                     <td>${action.actionHolder ? action.actionHolder.getFullName() : ''}</td>
                     <td>${action.week}</td>
                     <td>${action.isDone ? 'ja' : 'nee'}</td>
                     <td>${action.comments}</td></tr>`;
        });
        html += '</table>';

        return html;
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
