import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormControl, FormGroup } from '@angular/forms';

import { ProjectService } from '../../../shared/packages/project-package/project.service';
import { Organisation } from '../../../shared/packages/organisation-package/organisation.model';
import { OrganisationService } from '../../../shared/packages/organisation-package/organisation.service';
import { ToastService } from '../../../shared/toast.service';

export interface DefaultPopupData {
    title: string;
    placeholder: string;
    submitButton: string;
    id?: number;
    organisation: Organisation;
}

@Component({
    selector: 'cim-project-popup.component',
    templateUrl: './project-popup.component.html',
    styleUrls: ['./project-popup.component.css']
})
export class ProjectPopupComponent {
    public projectForm: FormGroup = new FormGroup({
        projectName: new FormControl(''),
    });

    constructor(
        public dialogRef: MatDialogRef<ProjectPopupComponent>,
        @Inject(MAT_DIALOG_DATA) public data: DefaultPopupData,
        private projectService: ProjectService,
        private organisationService: OrganisationService,
        private toastService: ToastService,
    ) {
        this.projectForm.controls.projectName.setValue(data.id ? data.placeholder : '');
    }

    onNoClick(e: MouseEvent): void {
        e.preventDefault();
        e.stopPropagation();
        this.dialogRef.close();
    }

    public onSubmit() {
        const projectName = this.projectForm.controls.projectName.value;
        if (projectName !== '') {
            if (this.data.id) {
                this.projectService.updateProject({ name: projectName }, this.data.id).then((value) => {
                    this.toastService.showSuccess('Project: ' + this.data.placeholder + ' is bewerkt', 'Bewerkt');
                    this.dialogRef.close(value);
                });
            } else {
                this.projectService.postProjectWithDefaultTemplate({ name: projectName }, this.data.organisation).then((value) => {
                    this.toastService.showSuccess('Project: ' + projectName + ' is toegevoegd', 'Toegevoegd');
                    this.dialogRef.close(value);
                });
            }
        }
    }
}
