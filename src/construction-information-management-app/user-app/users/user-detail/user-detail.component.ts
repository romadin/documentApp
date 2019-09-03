import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MatDialog, MatListOption } from '@angular/material';
import { combineLatest, Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { duplicateValidator } from '../../../../shared/form-validator/custom-validators';
import { Company } from '../../../../shared/packages/company-package/company.model';
import { CompanyService } from '../../../../shared/packages/company-package/company.service';
import { isCompany } from '../../../../shared/packages/company-package/interface/company.interface';
import { ConfirmPopupComponent, ConfirmPopupData } from '../../../popups/confirm-popup/confirm-popup.component';
import { SelectedProject } from '../../../popups/user-popup/user-popup.component';
import { ToastService } from '../../../../shared/toast.service';
import { ErrorMessage } from '../../../../shared/type-guard/error-message';
import { Organisation } from '../../../../shared/packages/organisation-package/organisation.model';
import { ProjectService } from '../../../../shared/packages/project-package/project.service';
import { Project } from '../../../../shared/packages/project-package/project.model';
import { UserService } from '../../../../shared/packages/user-package/user.service';
import { User } from '../../../../shared/packages/user-package/user.model';
import { MailService } from '../../../../shared/service/mail.service';
import { LoadingService } from '../../../../shared/loading.service';

export interface CompanyByProjectId {
    [ id: number ]: Company[];
}
@Component({
  selector: 'cim-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css']
})
export class UserDetailComponent implements OnInit, AfterViewInit {
    @Input() currentUser: User;
    @Output() closeDetailView: EventEmitter<boolean> = new EventEmitter<boolean>();
    projects: Project[];
    userForm: FormGroup = new FormGroup({
        firstName: new FormControl(''),
        insertion: new FormControl(''),
        lastName: new FormControl(''),
        email: new FormControl(''),
        function: new FormControl(''),
        phoneNumber: new FormControl(''),
        company: new FormControl(''),
    });
    imageToUpload: File;
    imageSrc: any;
    selectedProjects: SelectedProject = {};
    companies: Company[];
    private fileReader: FileReader = new FileReader();
    private existingItems: string[] = [];
    private formHasChanged = false;
    private organisation: Organisation;
    private companiesByProjectId: CompanyByProjectId = {};
    private projectsUserHasChanged: boolean;
    private _user: User;

    constructor(
        private projectService: ProjectService,
        private userService: UserService,
        private sanitizer: DomSanitizer,
        private activatedRoute: ActivatedRoute,
        private mailService: MailService,
        private companyService: CompanyService,
        private toast: ToastService,
        private loadingService: LoadingService,
        private dialog: MatDialog,
    ) {}

    @Input()
    set user(user: User) {
        this._user = user;
        this.imageSrc = this.sanitizer.bypassSecurityTrustStyle('url( "/assets/images/defaultProfile.png")');
        if (user) {
            if (this.user.image) {
                this.user.image.subscribe((blobValue) => {
                    if (blobValue) {
                        this.fileReader.readAsDataURL(blobValue);
                    }
                });
            }
            this.setFormValue();
        } else {
            this.userForm.reset();
        }
    }

    get user(): User {
        return this._user;
    }

    ngOnInit() {
        this.organisation = <Organisation>this.activatedRoute.snapshot.data.organisation;
        this.userForm.controls.email.setValidators([Validators.email]);

        this.getProjectsAndCompanies();

        this.fileReader.addEventListener('loadend', () => {
            const imageString =  JSON.stringify(this.fileReader.result).replace(/\\n/g, '');
            this.imageSrc = this.sanitizer.bypassSecurityTrustStyle('url(' + imageString + ')');
        }, false);
    }

    ngAfterViewInit() {
        this.onFormChanges();
    }

    public onCloseDetailView(event?: Event) {
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }
        this.closeDetailView.emit(true);
    }

    public onSubmit(e: Event) {
        e.stopPropagation();

        this.projectsHasChanged();
        if (this.userForm.valid && this.formHasChanged) {
            const data = new FormData();

            data.append('firstName', this.userForm.controls.firstName.value);
            data.append('lastName', this.userForm.controls.lastName.value);
            data.append('email', this.userForm.controls.email.value);
            data.append('phoneNumber', this.userForm.controls.phoneNumber.value);
            data.append('function', this.userForm.controls.function.value);
            data.append('projectsId', JSON.stringify(Object.keys(this.selectedProjects)));

            if (this.imageToUpload) {
                data.append('image', this.imageToUpload, this.imageToUpload.name);
            }
            if (this.userForm.controls.insertion.value !== null) {
                data.append('insertion', this.userForm.controls.insertion.value);
            }

            this.promiseCompany().then((company: Company|false) => {
                if (company) {
                    data.append('companyId', company.id.toString(10));
                }

                if (this.user) {
                    this.user.company = company ? company : this.user.company;
                    this.userService.editUser(this.user, data).subscribe((value: User | ErrorMessage) => {
                        if (value instanceof User) {
                            this.toast.showSuccess('Gebruiker: ' +  value.getFullName() + ' is bewerkt', 'Bewerkt');
                            this.onCloseDetailView();
                            if (this.projectsUserHasChanged) {
                                this.companyService.updateCacheObject = true;
                            }
                        } else {
                            this.showErrorMessage(value);
                        }
                    });
                } else {
                    this.userService.postUser(data, {organisationId: this.organisation.id }).subscribe((user: User | ErrorMessage) => {
                        this.loadingService.isLoading.next(false);
                        if (user instanceof User) {
                            this.mailService.sendUserActivation(user);
                            this.toast.showSuccess('Gebruiker: ' + this.userForm.controls.firstName.value + ' is toegevoegd', 'Toegevoegd');
                            this.user = user;
                            if (this.projectsUserHasChanged) {
                                this.companyService.updateCacheObject = true;
                            }
                        } else {
                            this.showErrorMessage(<ErrorMessage>user);
                        }
                    });
                }
            });
        }
    }

    onProjectSelect(project: Project, option: MatListOption): void {
        if (!option.selected) {
            delete this.selectedProjects[project.id];
        } else {
            this.selectedProjects[project.id] = project;
        }
    }

    onImageUpload(event: Event): void {
        if ((<HTMLInputElement>event.target).files && (<HTMLInputElement>event.target).files[0]) {
            this.imageToUpload = (<HTMLInputElement>event.target).files[0];
            this.fileReader.readAsDataURL(this.imageToUpload);
            this.formHasChanged = true;
        }
    }

    checkProjectSelected(project: Project): boolean {
        if (this.user) {
            if ( this.user.projectsId.find(projectId => projectId === project.id) ) {
                return true;
            }
            return false;
        }
        return false;
    }
    displayView(object?: any): string | undefined {
        return object ? object.name : undefined;
    }

    private changeCompany(companyName: string): Subject<Company|false> {
        const popupData: ConfirmPopupData = {
            title: 'Verander Bedrijf',
            name: companyName,
            message: 'Wilt u een nieuwe bedrijf aanmaken of wilt u het huidige bedrijf bewerken',
            firstButton: 'Nieuwe bedrijf aanmaken',
            secondButton: 'Huidige bedrijf bewerken'
        };
        const selectedProjectsId = Object.keys(this.selectedProjects).map(id => parseInt(id, 10));
        const companySubject: Subject<Company|false> = new Subject<Company>();

        this.dialog.open(ConfirmPopupComponent, {width: '450px', data: popupData}).afterClosed().subscribe((action) => {
            if (action === 'cancel') {
                companySubject.next(false);
            } else if (action) {
                this.companyService.createCompany({name: companyName}, selectedProjectsId)
                    .subscribe(company => {
                        companySubject.next(company);
                    });
            } else {
                const currentCompany: Company = this.user.company;
                currentCompany.name = companyName;
                this.companyService.updateCompany(currentCompany, {name: companyName}, selectedProjectsId).subscribe(company => {
                    companySubject.next(company);
                });
            }
        });

        return companySubject;
    }

    private promiseCompany(): Promise<Company|false> {
        return new Promise((resolve) => {
            const newCompany = this.userForm.controls.company.value;
            if (typeof newCompany === 'string' && !this.user) {
                const selectedProjectsId = Object.keys(this.selectedProjects).map(id => parseInt(id, 10));
                this.companyService.createCompany({name: newCompany}, selectedProjectsId).subscribe(company => {
                    resolve(company);
                });
            } else if (isCompany(newCompany) && !this.user) {
                resolve(newCompany);
            } else if (isCompany(newCompany) && newCompany.id !== this.user.company.id) {
                resolve(newCompany);
            } else if (typeof newCompany === 'string') {
                this.changeCompany(newCompany).subscribe(company => {
                    resolve(company);
                });
            } else {
                resolve(false);
            }
        });
    }

    private setFormValue() {
        this.userForm.controls.firstName.setValue(this.user.firstName);
        this.userForm.controls.insertion.setValue(this.user.insertion !== null ? this.user.insertion : '');
        this.userForm.controls.lastName.setValue(this.user.lastName);
        this.userForm.controls.email.setValue(this.user.email);
        this.userForm.controls.phoneNumber.setValue(this.user.phoneNumber);
        this.userForm.controls.function.setValue(this.user.function);
        this.userForm.controls.company.setValue(this.user.company);
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

        this.projectService.getProjects(this.organisation).subscribe((projects: Project[]) => {
            this.projects = projects;
            if (this.projects) {
                this.companies = [];
                this.projects.forEach(project => {
                    observableContainer = observableContainer.concat(this.companyService.getCompaniesByProject(project).pipe(
                        map(companies => {
                            this.companiesByProjectId[project.id] = companies;
                            return companies;
                        })
                    ));
                    if (this.user && this.user.projectsId.find(projectId => projectId === project.id) ) {
                        this.selectedProjects[project.id] = project;
                    }
                });
                combineLatest(observableContainer).pipe(
                    map(results => {
                        let companies: any = [];
                        results.map(companyArray => companies = companies.concat(companyArray));
                        return companies;
                    })
                ).subscribe(companies => {
                    if (companies.find(c => c === null || c === undefined) === undefined) {
                        this.companies = Array.from(new Set(companies.map(c => c.id))).map(id => companies.find(c => c.id === id));
                    }
                });
            }
        });
    }

    private projectsHasChanged() {
        if (this.user) {
            if (this.user.projectsId.length !== Object.keys(this.selectedProjects).length) {
                this.formHasChanged = true;
                this.projectsUserHasChanged = true;
                return;
            }
            for (const selectedProjectId in this.selectedProjects) {
                if (this.user.projectsId.find(projectId => projectId === parseInt(selectedProjectId, 10)) === undefined) {
                    this.formHasChanged = true;
                }
            }
        }
    }

    private onFormChanges() {
        let oldValue = this.userForm.value;
        this.userForm.valueChanges.subscribe(value => {
            for (const key in value) {
                if (value.hasOwnProperty(key) && oldValue.hasOwnProperty(key)) {
                    if (value[key] !== oldValue[key]) {
                        this.formHasChanged = true;
                        oldValue = value;
                        break;
                    }
                    this.formHasChanged = false;
                }
            }
        });
    }
}
