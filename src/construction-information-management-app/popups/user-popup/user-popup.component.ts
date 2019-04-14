import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

import { DefaultPopupData } from '../project-popup/project-popup.component';
import { UserService } from '../../../shared/packages/user-package/user.service';
import { ProjectService } from '../../../shared/packages/project-package/project.service';
import { Project } from '../../../shared/packages/project-package/project.model';
import { LoadingService } from '../../../shared/loading.service';
import { User } from '../../../shared/packages/user-package/user.model';
import { MailService } from '../../../shared/service/mail.service';
import { duplicateValidator } from '../../../shared/form-validator/custom-validators';
import { ToastService } from '../../../shared/toast.service';
import { ErrorMessage } from '../../../shared/type-guard/error-message';
import { objectIsEmpty } from '../../../shared/helpers/practice-functions';

export interface SelectedProject {
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
        phoneNumber: new FormControl(''),
        function: new FormControl(''),
        company: new FormControl(''),
    });
    public projectsId = new FormControl();
    public allProjects: Project[];
    public selectedProjects: SelectedProject = {};
    public imageSrc: any;
    public imageToUpload: File;
    private existingItems: string[] = [];

    constructor(
        public dialogRef: MatDialogRef<UserPopupComponent>,
        @Inject(MAT_DIALOG_DATA) public data: DefaultPopupData,
        private userService: UserService,
        private mailService: MailService,
        private projectService: ProjectService,
        private loadingService: LoadingService,
        private toast: ToastService,
    ) {
        this.imageSrc = '/assets/images/defaultProfile.png';
        this.projectService.getProjects(this.data.organisation).subscribe((projects: Project[]) => {
            this.allProjects = projects;
        });

        this.userForm.controls.email.setValidators([Validators.email]);
    }

    onNoClick(event: MouseEvent): void {
        event.preventDefault();
        event.stopPropagation();
        this.dialogRef.close();
    }

    public onSubmit() {
        if ( objectIsEmpty(this.selectedProjects) ) {
            return alert('Er is geen project gekozen!');
        }
        this.loadingService.isLoading.next(true);

        const data = new FormData();

        data.append('firstName', this.userForm.controls.firstName.value);
        data.append('insertion', this.userForm.controls.insertion.value ? this.userForm.controls.insertion.value : '');
        data.append('lastName', this.userForm.controls.lastName.value);
        data.append('email', this.userForm.controls.email.value);
        data.append('phoneNumber', this.userForm.controls.phoneNumber.value);
        data.append('function', this.userForm.controls.function.value);
        data.append('company', this.userForm.controls.company.value);
        data.append('projectsId', JSON.stringify(Object.keys(this.selectedProjects)));

        if (this.imageToUpload) {
            data.append('image', this.imageToUpload, this.imageToUpload.name);
        }
        this.userService.postUser(data, {organisationId: this.data.organisation.id }).subscribe((user: User | ErrorMessage) => {
            this.loadingService.isLoading.next(false);
            if (user instanceof User) {
                this.dialogRef.close(user);
                this.mailService.sendUserActivation(user);
                this.toast.showSuccess('Gebruiker: ' +  this.userForm.controls.firstName.value + ' is toegevoegd', 'Toegevoegd');
            } else {
                this.showErrorMessage(<ErrorMessage>user);
            }
        });
    }

    public onProjectSelect(project: Project): void {
        if (this.selectedProjects.hasOwnProperty(project.getId())) {
            delete this.selectedProjects[project.getId()];
            return;
        }

        this.selectedProjects[project.getId()] = project;
    }

    public onImageUpload(event: Event): void {
        if ((<HTMLInputElement>event.target).files && (<HTMLInputElement>event.target).files[0]) {
            this.imageToUpload = (<HTMLInputElement>event.target).files[0];

            const reader = new FileReader();
            reader.onload = e => this.imageSrc = reader.result;

            reader.readAsDataURL(this.imageToUpload);
        }
    }

    private showErrorMessage(message: ErrorMessage): void {
        for (const key in message) {
            const currentValue = this.userForm.controls[key].value;
            if (!this.existingItems.find(item => item === currentValue)) {
                this.existingItems.push(currentValue);
            }
            const validators = [duplicateValidator(this.existingItems)];
            if (key === 'email') {
                validators.push(Validators.email);
            }
            this.userForm.controls[key].setValidators(validators);
            this.userForm.controls[key].setErrors({'duplicate': true});
        }
    }
}
