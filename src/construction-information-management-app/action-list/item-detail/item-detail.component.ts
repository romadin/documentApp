import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { Action } from '../../../shared/packages/action-package/action.model';
import { ActionService } from '../../../shared/packages/action-package/action.service';

interface Status {
    name: string;
    value: boolean;
}

@Component({
  selector: 'cim-item-detail',
  templateUrl: './item-detail.component.html',
  styleUrls: ['./item-detail.component.css']
})
export class ItemDetailComponent implements OnInit {
    @Input() projectId: number;
    @Input() action: Action | null;

    public actionForm: FormGroup = new FormGroup({
        code: new FormControl(),
        description: new FormControl(),
        general: new FormControl(),
        actionHolder: new FormControl(),
        week: new FormControl(),
        comments: new FormControl(),
        projectId: new FormControl(),
        isDone: new FormControl(),
    });
    public selectedStatus: Status;
    public statusToSelect = [{ name: 'in behandeling', value: 0 }, {name: 'klaar', value: 1 }];

    constructor(private actionService: ActionService) { }

    ngOnInit() {
        if (this.action) {
            this.setFormValue();
        }
    }

    public onSubmit() {
        const data =  {
            code: this.actionForm.controls.code.value,
            general: this.actionForm.controls.general.value,
            description: this.actionForm.controls.description.value,
            holder: this.actionForm.controls.actionHolder.value,
            week: this.actionForm.controls.week.value,
            comments: this.actionForm.controls.comments.value,
            projectId: this.projectId,
            isDone: this.selectedStatus.value
        };
        this.actionService.postAction(data).subscribe((newAction: Action) => {
        });
    }

    public onStatusSelect(status: Status): void {
        this.selectedStatus = status;
    }

    private setFormValue(): void {
        this.actionForm.controls.code.setValue(this.action.code);
        this.actionForm.controls.description.setValue(this.action.description);
        this.actionForm.controls.actionHolder.setValue(this.action.actionHolder);
        this.actionForm.controls.week.setValue(this.action.week);
        this.actionForm.controls.comments.setValue(this.action.comments);
        this.actionForm.controls.isDone.setValue(this.action.isDone);
    }

}
