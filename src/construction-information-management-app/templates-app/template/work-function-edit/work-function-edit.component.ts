import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { WorkFunction } from '../../../../shared/packages/work-function-package/work-function.model';
import { FormControl, FormGroup } from '@angular/forms';
import { WorkFunctionService } from '../../../../shared/packages/work-function-package/work-function.service';
import { Template } from '../../../../shared/packages/template-package/template.model';
import { ToastService } from '../../../../shared/toast.service';

@Component({
  selector: 'cim-work-function-edit',
  templateUrl: './work-function-edit.component.html',
  styleUrls: ['./work-function-edit.component.css']
})
export class WorkFunctionEditComponent implements OnInit {
    @Input() template: Template;
    @Output() closeView: EventEmitter<boolean> = new EventEmitter<boolean>();
    workFunctionForm: FormGroup = new FormGroup({
        name: new FormControl('')
    });
    private _workFunction: WorkFunction;

    constructor(private workFunctionService: WorkFunctionService, private toast: ToastService) { }

    @Input()
    set workFunction(workFunction: WorkFunction) {
        this._workFunction = workFunction;
        if (workFunction) {
            this.setFormValue();
        }
    }

    get workFunction(): WorkFunction {
        return this._workFunction;
    }

    ngOnInit() {
    }

    onCloseView(e: Event): void {
        e.preventDefault();
        e.stopPropagation();
        this.closeView.emit(true);
    }

    onSubmit(): void {
        if (!this.workFunctionForm.invalid) {
            const body = { name: this.workFunctionForm.controls.name.value };
            if (this.workFunction) {
                this.workFunctionService.updateWorkFunction(this.workFunction, body).subscribe(workFunction => {
                    this.workFunction = workFunction;
                    this.toast.showSuccess('Gebruiker: ' +  workFunction.name + ' is bewerkt', 'Bewerkt');
                });
            } else {
                body['templateId'] = this.template.id;
                this.workFunctionService.createWorkFunction(this.template, body).subscribe(workFunction => {
                    this.template.workFunctions.push(workFunction);
                    this.workFunction = workFunction;
                    this.toast.showSuccess('Functie: ' +  workFunction.name + ' is toegevoegd', 'Toegevoegd');
                });
            }
        }
    }

    private setFormValue() {
        this.workFunctionForm.controls.name.setValue(this.workFunction.name);
    }

}