import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTable, MatTableDataSource } from '@angular/material';

import { ActionService } from '../../shared/packages/action-package/action.service';
import { Action } from '../../shared/packages/action-package/action.model';

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
    public displayedColumns: string[] = ['code', 'description', 'actionHolder', 'status'];
    selection = new SelectionModel<Action>(true, []);

    constructor(private actionService: ActionService, private activatedRoute: ActivatedRoute ) { }

    ngOnInit() {
        this.projectId = parseInt(this.activatedRoute.snapshot.paramMap.get('id'), 10);
        this.actionService.getActionsByProject(this.projectId).subscribe((actions) => {
            if (actions.length > 0) {
                this.table.renderRows();
            }
            this.actions = actions;
        });
    }

    public showActionEditor(event: MouseEvent): void {
        event.stopPropagation();
        this.showItemDetail = true;
    }

    public editItem(event: MouseEvent, action: Action): void {
        event.stopPropagation();
    }

    public OnCloseDetail(closeEdit: boolean): void {
        this.showItemDetail = !closeEdit;
        this.actionToEdit = undefined;
    }


    public changeActionStatus(e: MouseEvent): void {
        e.preventDefault();
        e.stopPropagation();
        // @todo save action change with a time out.
    }
}
