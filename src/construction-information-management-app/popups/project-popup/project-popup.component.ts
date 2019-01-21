import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormControl, FormGroup } from '@angular/forms';
import { ProjectService } from '../../../shared/packages/project-package/project.service';

export interface DialogData {
    animal: string;
    name: string;
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

    onNoClick(): void {
        this.dialogRef.close();
    }

    public onSubmit() {
        const projectName = this.projectForm.controls.projectName.value;

        this.projectService.postProject({ name: projectName }).then((value) => {
            this.dialogRef.close(value);
        });
    }
}
