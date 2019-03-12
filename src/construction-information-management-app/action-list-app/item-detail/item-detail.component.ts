import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { Action } from '../../../shared/packages/action-package/action.model';
import { ActionService } from '../../../shared/packages/action-package/action.service';

interface Status {
    name: string;
    value: boolean;
}

@Component({
  selector: 'cim-action-item-detail',
  templateUrl: './item-detail.component.html',
  styleUrls: ['./item-detail.component.css']
})
export class ItemDetailComponent implements OnInit {
    @Input() projectId: number;
    @Input() action: Action | null;
    @Output() closeEdit: EventEmitter<boolean> = new EventEmitter<boolean>();

    public actionForm: FormGroup = new FormGroup({
        description: new FormControl(),
        actionHolder: new FormControl(),
        week: new FormControl(),
        comments: new FormControl(),
        projectId: new FormControl(),
    });
    public selectedStatus: Status;
    public statusToSelect = [{ name: 'in behandeling', value: false }];

    constructor(private actionService: ActionService) { }

    ngOnInit() {
        if (this.action) {
            this.setFormValue();
        }
    }

    public onSubmit() {
        const data =  {
            description: this.actionForm.controls.description.value,
            actionHolder: this.actionForm.controls.actionHolder.value,
            week: this.actionForm.controls.week.value,
            comments: this.actionForm.controls.comments.value,
            projectId: this.projectId,
        };

        if ( this.action ) {
            this.action.update(data);
            this.actionService.editAction(this.action, data);
            return;
        }

        this.actionService.postAction(data).subscribe((newAction: Action) => {
            this.closeEdit.emit(true);
        });
    }

    public onCancel(e: MouseEvent): void {
        e.preventDefault();
        e.stopPropagation();
        this.closeEdit.emit(true);
    }

    public onStatusSelect(status: Status): void {
        this.selectedStatus = status;
    }
    private setFormValue(): void {
        this.actionForm.controls.description.setValue(this.action.description);
        this.actionForm.controls.actionHolder.setValue(this.action.actionHolder);
        this.actionForm.controls.week.setValue(this.action.week);
        this.actionForm.controls.comments.setValue(this.action.comments);
    }
}
