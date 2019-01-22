import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

import { DialogData } from '../project-popup/project-popup.component';
import { UserService } from '../../../shared/packages/user-package/user.service';
import { ProjectService } from '../../../shared/packages/project-package/project.service';
import { Project } from '../../../shared/packages/project-package/project.model';

interface SelectedProject {
    [id: number]: Project;
}

@Component({
  selector: 'cim-user-popup',
  templateUrl: './user-popup.component.html',
  styleUrls: ['./user-popup.component.css']
})
export class UserPopupComponent {
    public userForm: FormGroup = new FormGroup({
        firstName: new FormControl(''),
        insertion: new FormControl(''),
        lastName: new FormControl(''),
        email: new FormControl(''),
        function: new FormControl(''),
        password: new FormControl(''),
    });
    public projectsId = new FormControl();
    public allProjects: Project[];
    public selectedProjects: SelectedProject = {};

    constructor(
        public dialogRef: MatDialogRef<UserPopupComponent>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData,
        private userService: UserService,
        private projectService: ProjectService
    ) {
        this.projectService.getProjects().subscribe((projects: Project[]) => {
            this.allProjects = projects;
        });
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    public onSubmit() {
        if ( this.objectIsEmpty(this.selectedProjects) ) {
            return alert('Er is geen project gekozen!');
        }

        const data = {
            firstName: this.userForm.controls.firstName.value,
            insertion: this.userForm.controls.insertion.value,
            lastName: this.userForm.controls.lastName.value,
            email: this.userForm.controls.email.value,
            function: this.userForm.controls.function.value,
            password: this.userForm.controls.password.value,
            projectsId: Object.keys(this.selectedProjects),
        };
        this.userService.postUser(data).subscribe((value) => {
            this.dialogRef.close(value);
        });
    }

    public onProjectSelect(project: Project): void {
        if (this.selectedProjects.hasOwnProperty(project.getId())) {
            delete this.selectedProjects[project.getId()];
            return;
        }

        this.selectedProjects[project.getId()] = project;

    }

    private objectIsEmpty(object: any): boolean {
        for (const key in object ) {
            if (object.hasOwnProperty(key)) {
                return false;
            }
        }
        return true;
    }
}
