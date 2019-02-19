import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute,  } from '@angular/router';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTable  } from '@angular/material';

import { ActionService } from '../../shared/packages/action-package/action.service';
import { Action } from '../../shared/packages/action-package/action.model';
import { ApiActionEditPostData } from '../../shared/packages/action-package/api-action.interface';
import { RouterService } from '../../shared/service/router.service';

@Component({
  selector: 'cim-action-list',
  templateUrl: './action-list.component.html',
  styleUrls: ['./action-list.component.css']
})
export class ActionListComponent implements OnInit {
    @ViewChild(MatTable) table: MatTable<any>;
    public actions: Action[];
    public actionToEdit: Action;
    public showItemDetail = false;
    public projectId: number;
    public displayedColumns: string[] = ['code', 'description', 'actionHolder', 'week', 'status'];
    public selection = new SelectionModel<Action>(true, []);

    private timerId: number;

    constructor(private actionService: ActionService,
                private activatedRoute: ActivatedRoute,
                private routerService: RouterService) { }

    ngOnInit() {
        this.projectId = parseInt(this.activatedRoute.snapshot.paramMap.get('id'), 10);
        this.actionService.getActionsByProject(this.projectId).subscribe((actions) => {
            if (actions.length > 0 && this.table) {
                this.table.renderRows();
            }
            this.actions = actions;
        });
        this.routerService.setBackRouteParentFromActivatedRoute(this.activatedRoute.parent);
    }

    public showActionEditor(event: MouseEvent): void {
        event.stopPropagation();
        this.showItemDetail = true;
    }

    public editItem(event: MouseEvent, action: Action): void {
        event.stopPropagation();

        this.actionToEdit = action;
        this.showItemDetail = true;
    }

    public OnCloseDetail(closeEdit: boolean): void {
        this.showItemDetail = !closeEdit;
        this.actionToEdit = undefined;
    }


    public changeActionStatus(e: MouseEvent, action: Action): void {
        e.preventDefault();
        e.stopPropagation();
        if (this.timerId) {
            clearTimeout(this.timerId);
        }
        this.timerId = setTimeout(() => {
            action.isDone = !action.isDone;
            const postData: ApiActionEditPostData  = {
                isDone: action.isDone
            };
            this.actionService.editAction(action, postData);
        }, 500);
    }
}
