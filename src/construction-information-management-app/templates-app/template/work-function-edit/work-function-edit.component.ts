import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Project } from '../../../../shared/packages/project-package/project.model';
import { WorkFunction } from '../../../../shared/packages/work-function-package/work-function.model';
import { FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { WorkFunctionService } from '../../../../shared/packages/work-function-package/work-function.service';
import { Template } from '../../../../shared/packages/template-package/template.model';
import { ToastService } from '../../../../shared/toast.service';

@Component({
  selector: 'cim-work-function-edit',
  templateUrl: './work-function-edit.component.html',
  styleUrls: ['./work-function-edit.component.css']
})
export class WorkFunctionEditComponent implements OnInit {
    @Input() parent: Template|Project;
    @Output() closeView: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output() onAddedWorkFunction: EventEmitter<WorkFunction> = new EventEmitter<WorkFunction>();
    workFunctionForm: FormGroup = new FormGroup({
        name: new FormControl('', Validators.required)
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

    onSubmit(formDirective: FormGroupDirective): void {
        if (!this.workFunctionForm.invalid) {
            const body = { name: this.workFunctionForm.controls.name.value };
            if (this.workFunction) {
                this.workFunctionService.updateWorkFunction(this.workFunction, body).subscribe(workFunction => {
                    this.workFunction = workFunction;
                    this.toast.showSuccess('Gebruiker: ' +  workFunction.name + ' is bewerkt', 'Bewerkt');
                });
            } else {
                this.parent instanceof Template ? body['templateId'] = this.parent.id : body['projectId'] = this.parent.id;
                this.workFunctionService.createWorkFunction(this.parent, body).subscribe(workFunction => {
                    this.onAddedWorkFunction.emit(workFunction);
                    this.toast.showSuccess('Functie: ' +  workFunction.name + ' is toegevoegd', 'Toegevoegd');
                    formDirective.resetForm();
                    this.workFunctionForm.reset();
                });
            }
        }
    }

    private setFormValue() {
        this.workFunctionForm.controls.name.setValue(this.workFunction.name);
    }

}
