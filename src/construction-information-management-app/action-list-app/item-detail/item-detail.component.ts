import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { Action } from '../../../shared/packages/action-package/action.model';
import { ActionService } from '../../../shared/packages/action-package/action.service';
import { LoadingService } from '../../../shared/loading.service';
import { ToastService } from '../../../shared/toast.service';
import { weekNumberValidator } from '../../../shared/form-validator/custom-validators';

interface Status {
    name: string;
    value: boolean;
}

@Component({
    selector: 'cim-action-item-detail',
    templateUrl: './item-detail.component.html',
    styleUrls: ['./item-detail.component.css'],
})
export class ItemDetailComponent implements OnInit {
    @Input() projectId: number;
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

    private _action: Action | null;

    @Input()
    set action(action: Action | null) {
        this._action = action;
        this.setFormValue();
    }

    get action(): Action | null {
        return this._action;
    }

    constructor(private actionService: ActionService,
                private loadingService: LoadingService,
                private toastService: ToastService) { }

    ngOnInit() {
        this.actionForm.controls.description.setValidators([ Validators.required ]);
        this.actionForm.controls.week.setValidators([ Validators.maxLength(2), weekNumberValidator(52) ]);
    }

    onSubmit() {
        if (this.actionForm.valid) {
            this.loadingService.isLoading.next(true);
            const data =  {
                description: this.actionForm.controls.description.value,
                actionHolder: this.actionForm.controls.actionHolder.value,
                week: this.actionForm.controls.week.value !== '' ? this.actionForm.controls.week.value : null,
                comments: this.actionForm.controls.comments.value,
                projectId: this.projectId,
            };

            if ( this.action ) {
                this.action.update(data);
                this.actionService.editAction(this.action, data);
                this.hideLoadShowToast('Actie: ' + data.description + ' is bewerkt', 'Bewerkt');
                return;
            }

            this.actionService.postAction(data).subscribe((newAction: Action) => {
                if (newAction) {
                    this.hideLoadShowToast('Actie: ' + data.description + ' is toegevoegd', 'Toegevoegd');
                    this.closeEdit.emit(true);
                }
            });
        }
    }

    onCancel(e: MouseEvent): void {
        e.preventDefault();
        e.stopPropagation();
        this.closeEdit.emit(true);
    }

    onStatusSelect(status: Status): void {
        this.selectedStatus = status;
    }

    private setFormValue(): void {
        this.actionForm.controls.description.setValue(this.action ? this.action.description : '');
        this.actionForm.controls.actionHolder.setValue(this.action ? this.action.actionHolder : '');
        this.actionForm.controls.week.setValue(this.action ? this.action.week : '');
        this.actionForm.controls.comments.setValue(this.action ? this.action.comments : '');
    }

    private hideLoadShowToast(toastMessage: string, toastTitle): void {
        this.loadingService.isLoading.next(false);
        this.toastService.showSuccess(toastMessage, toastTitle);
    }
}
