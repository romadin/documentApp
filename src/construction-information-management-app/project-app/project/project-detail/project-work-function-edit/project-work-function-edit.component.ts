import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Folder } from '../../../../../shared/packages/folder-package/folder.model';

import { WorkFunctionService } from '../../../../../shared/packages/work-function-package/work-function.service';
import { ToastService } from '../../../../../shared/toast.service';

@Component({
  selector: 'cim-project-work-function-edit',
  templateUrl: './project-work-function-edit.component.html',
  styleUrls: ['./project-work-function-edit.component.css']
})
export class ProjectWorkFunctionEditComponent implements OnInit {
    @Input() projectId: number;
    @Output() closeView: EventEmitter<boolean> = new EventEmitter<boolean>();
    workFunctionForm: FormGroup = new FormGroup({
        name: new FormControl('')
    });
    private _workFunctionFolder: Folder;

    constructor(private workFunctionService: WorkFunctionService, private toast: ToastService) { }

    @Input()
    set workFunctionFolder(workFunctionFolder: Folder) {
        this._workFunctionFolder = workFunctionFolder;
        if (workFunctionFolder) {
            this.setFormValue();
        }
    }

    get workFunctionFolder(): Folder {
        return this._workFunctionFolder;
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
            // const body = { name: this.workFunctionForm.controls.name.value };
            // if (this.workFunctionFolder) {
            //     this.workFunctionService.updateWorkFunction(this.workFunctionFolder, body).subscribe(workFunctionFolder => {
            //         this.workFunctionFolder = workFunctionFolder;
            //         this.toast.showSuccess('Gebruiker: ' +  workFunctionFolder.name + ' is bewerkt', 'Bewerkt');
            //     });
            // } else {
            //     body['templateId'] = this.projectId.id;
            //     this.workFunctionService.createWorkFunction(this.projectId, body).subscribe(workFunctionFolder => {
            //         this.projectId.workFunctions.push(workFunctionFolder);
            //         this.workFunctionFolder = workFunctionFolder;
            //         this.toast.showSuccess('Functie: ' +  workFunctionFolder.name + ' is toegevoegd', 'Toegevoegd');
            //     });
            // }
        }
    }

    private setFormValue() {
        this.workFunctionForm.controls.name.setValue(this.workFunctionFolder.name);
    }

}
