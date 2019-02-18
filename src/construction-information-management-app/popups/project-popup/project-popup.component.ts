import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormControl, FormGroup } from '@angular/forms';
import { ProjectService } from '../../../shared/packages/project-package/project.service';

export interface DialogData {
    title: string;
    placeholder: string;
    submitButton: string;
    id?: number;
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
        @Inject(MAT_DIALOG_DATA) public data: DialogData,
        private projectService: ProjectService) {}

    onNoClick(e: MouseEvent): void {
        e.preventDefault();
        e.stopPropagation();
        this.dialogRef.close();
    }

    public onSubmit() {
        const projectName = this.projectForm.controls.projectName.value;

        if (this.data.id) {
            this.projectService.updateProject({ name: projectName }, this.data.id).then((value) => {
                this.dialogRef.close(value);
            });
        } else {
            this.projectService.postProjectWithDefaultTemplate({ name: projectName }).then((value) => {
                this.dialogRef.close(value);
            });
        }
    }
}