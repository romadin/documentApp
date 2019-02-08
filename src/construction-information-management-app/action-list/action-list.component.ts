import { Component, OnInit } from '@angular/core';
import { ActionService } from '../../shared/packages/action-package/action.service';
import { ActivatedRoute } from '@angular/router';
import { Action } from '../../shared/packages/action-package/action.model';

@Component({
  selector: 'cim-action-list',
  templateUrl: './action-list.component.html',
  styleUrls: ['./action-list.component.css']
})
export class ActionListComponent implements OnInit {
    public actions: Action[];
    public actionToEdit: Action;
    public showItemDetail = false;
    public projectId: number;

    constructor(private actionService: ActionService, private activatedRoute: ActivatedRoute ) { }

    ngOnInit() {
        this.projectId = parseInt(this.activatedRoute.snapshot.paramMap.get('id'), 10);
        this.actionService.getActionsByProject(this.projectId).subscribe((actions) => {
            this.actions = actions;
        });
    }

    public showActionEditor(event: MouseEvent): void {
        event.stopPropagation();
        this.showItemDetail = true;
    }

}
