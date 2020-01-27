import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatButtonToggleChange, MatDialog, MatDialogRef } from '@angular/material';
import { combineLatest, Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Company } from '../../../shared/packages/company-package/company.model';
import { CompanyService } from '../../../shared/packages/company-package/company.service';
import { isCompany } from '../../../shared/packages/company-package/interface/company.interface';
import { CompanyByProjectId } from '../../user-app/users/user-detail/user-detail.component';
import { RightSideView } from '../../work-function-app/partners/partners.component';

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
import { objectIsEmpty } from '../../../shared/helpers/practical-functions';

export interface SelectedProject {
    [id: number]: Project;
}

@Component({
  selector: 'cim-user-popup',
  templateUrl: './user-popup.component.html',
  styleUrls: ['./user-popup.component.css']
})
export class UserPopupComponent {
    userForm: FormGroup = new FormGroup({
        firstName: new FormControl(''),
        insertion: new FormControl(''),
        lastName: new FormControl(''),
        email: new FormControl(''),
        phoneNumber: new FormControl(''),
        function: new FormControl(''),
        company: new FormControl(''),
    });
    projectsId = new FormControl();
    allProjects: Project[];
    selectedProjects: SelectedProject = {};
    imageSrc: any;
    imageToUpload: File;
    currentProject: Project;
    companies: Company[];
    viewType: RightSideView = 'new';
    allUsers: User[];

    private existingItems: string[] = [];
    private companiesByProjectId: CompanyByProjectId = {};

    constructor(
        public dialogRef: MatDialogRef<UserPopupComponent>,
        @Inject(MAT_DIALOG_DATA) public data: DefaultPopupData,
        private userService: UserService,
        private mailService: MailService,
        private projectService: ProjectService,
        private companyService: CompanyService,
        private loadingService: LoadingService,
        private toast: ToastService,
    ) {
        this.imageSrc = '/assets/images/defaultProfile.png';
        const projectId: number = parseInt(location.pathname.split('/')[2], 10);

        this.getProjectsAndCompanies();

        this.projectService.getProjects(this.data.organisation).subscribe((projects: Project[]) => {
            this.allProjects = projects;
            this.currentProject = this.allProjects.find(project => project.id === projectId);
            this.selectedProjects[this.currentProject.id] = this.currentProject;
        });
        this.userService.getUsers({organisationId: this.data.organisation.id}).subscribe((users) => {
            this.allUsers = users;
        });

        this.userForm.controls.email.setValidators([Validators.email]);
    }

    onNoClick(event: MouseEvent | boolean): void {
        if (event instanceof MouseEvent) {
            event.preventDefault();
            event.stopPropagation();
        }
        this.dialogRef.close();
    }

    onSubmit() {
        if (this.userForm.valid) {
            if ( objectIsEmpty(this.selectedProjects) ) {
                return alert('Er is geen projectId gekozen!');
            }
            if ( this.allUsers.length === this.data.organisation.maxUser ) {
                return alert('De maximale aantal gebruikers zijn al bereikt');
            }
            this.loadingService.isLoading.next(true);

            const data = new FormData();

            data.append('firstName', this.userForm.controls.firstName.value);
            data.append('insertion', this.userForm.controls.insertion.value ? this.userForm.controls.insertion.value : '');
            data.append('lastName', this.userForm.controls.lastName.value);
            data.append('email', this.userForm.controls.email.value);
            data.append('phoneNumber', this.userForm.controls.phoneNumber.value);
            data.append('function', this.userForm.controls.function.value);
            data.append('projectsId', JSON.stringify(Object.keys(this.selectedProjects)));

            if (this.imageToUpload) {
                data.append('image', this.imageToUpload, this.imageToUpload.name);
            }
            this.promiseCompany().then((company: Company| false) => {
                if (company) {
                    data.append('companyId', company.id.toString(10));
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
            });
        }
    }

    onProjectSelect(project: Project): void {
        if (project.id !== this.currentProject.id) {
            if (this.selectedProjects.hasOwnProperty(project.id)) {
                delete this.selectedProjects[project.id];
                return;
            }
            this.selectedProjects[project.id] = project;
        }
    }

    onImageUpload(event: Event): void {
        if ((<HTMLInputElement>event.target).files && (<HTMLInputElement>event.target).files[0]) {
            this.imageToUpload = (<HTMLInputElement>event.target).files[0];

            const reader = new FileReader();
            reader.onload = e => this.imageSrc = reader.result;

            reader.readAsDataURL(this.imageToUpload);
        }
    }
    determineRightSide(e: MatButtonToggleChange): void {
        this.viewType = e.value;
    }

    displayView(object?: any): string | undefined {
        return object ? object.name : undefined;
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
    private getProjectsAndCompanies(): void {
        let observableContainer: Observable<Company[]>[] = [];

        this.projectService.getProjects(this.data.organisation).subscribe((projects: Project[]) => {
            this.allProjects = projects;
            if (this.allProjects) {
                this.companies = [];
                this.allProjects.forEach(project => {
                    observableContainer = observableContainer.concat(this.companyService.getCompaniesByProject(project).pipe(
                        map(companies => {
                            this.companiesByProjectId[project.id] = companies;
                            return companies;
                        })
                    ));
                });
                combineLatest(observableContainer).pipe(
                    map(results => {
                        let companies: any = [];
                        results.map(companyArray => companies = companies.concat(companyArray));
                        return companies;
                    })
                ).subscribe(companies => {
                    if (companies.find(c => c === null || c === undefined) === undefined) {
                        this.companies = [];
                        Object.keys(this.selectedProjects).forEach(projectId => {
                            this.companies = this.companies.concat(this.companiesByProjectId[projectId]);
                        });
                    }
                });
            }
        });
    }
    private promiseCompany(): Promise<Company|false> {
        return new Promise((resolve) => {
            const newCompany = this.userForm.controls.company.value;
            if (typeof newCompany === 'string') {
                const selectedProjectsId = Object.keys(this.selectedProjects).map(id => parseInt(id, 10));
                this.companyService.createCompany({name: newCompany}, selectedProjectsId).subscribe(company => {
                    resolve(company);
                });
            } else if (isCompany(newCompany)) {
                resolve(newCompany);
            } else {
                resolve(false);
            }
        });
    }
}
