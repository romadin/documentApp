import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { User } from '../../../shared/packages/user-package/user.model';
import { FormControl, FormGroup } from '@angular/forms';
import { ProjectService } from '../../../shared/packages/project-package/project.service';
import { Project } from '../../../shared/packages/project-package/project.model';
import { UserService } from '../../../shared/packages/user-package/user.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'cim-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css']
})
export class UserDetailComponent implements OnInit {
    @Input() user: User;
    @Output() closeDetailView: EventEmitter<boolean> = new EventEmitter<boolean>();
    projects: Project[];
    userForm: FormGroup = new FormGroup({
        firstName: new FormControl(''),
        insertion: new FormControl(''),
        lastName: new FormControl(''),
        email: new FormControl(''),
        function: new FormControl(''),
        phoneNumber: new FormControl(''),
    });
    imageToUpload: File;
    imageSrc: any;
    private fileReader: FileReader = new FileReader();
    constructor(private projectService: ProjectService,
                private userService: UserService,
                private sanitizer: DomSanitizer) {
        this.imageSrc = this.sanitizer.bypassSecurityTrustStyle('/assets/images/defaultProfile.png');
    }

    ngOnInit() {
        this.fileReader.addEventListener('loadend', () => {
            const imageString =  JSON.stringify(this.fileReader.result).replace(/\\n/g, '');
            this.imageSrc = this.sanitizer.bypassSecurityTrustStyle('url(' + imageString + ')');
        }, false);

        if (this.user.image) {
            this.user.image.subscribe((blobValue) => {
                if (blobValue) {
                    this.fileReader.readAsDataURL(blobValue);
                }
            });
        }
        Promise.all(this.getLinkedProjects()).then((projects) => {
            this.projects = projects;
        });
        this.setFormValue();
    }

    public onCloseDetailView() {
        this.closeDetailView.emit(true);
    }

    public onSubmit() {
        const data = new FormData();

        data.append('firstName', this.userForm.controls.firstName.value);
        data.append('insertion', this.userForm.controls.insertion.value);
        data.append('lastName', this.userForm.controls.lastName.value);
        data.append('email', this.userForm.controls.email.value);
        data.append('phoneNumber', this.userForm.controls.phoneNumber.value);
        data.append('function', this.userForm.controls.function.value);

        if (this.imageToUpload) {
            data.append('image', this.imageToUpload, this.imageToUpload.name);
        }

        this.userService.editUser(this.user, data).subscribe((value) => {
            this.onCloseDetailView();
        });
    }

    onImageUpload(event: Event): void {
        if ((<HTMLInputElement>event.target).files && (<HTMLInputElement>event.target).files[0]) {
            this.imageToUpload = (<HTMLInputElement>event.target).files[0];
            this.fileReader.readAsDataURL(this.imageToUpload);
        }
    }

    private setFormValue() {
        this.userForm.controls.firstName.setValue(this.user.firstName);
        this.userForm.controls.insertion.setValue(this.user.insertion !== null ? this.user.insertion : '');
        this.userForm.controls.lastName.setValue(this.user.lastName);
        this.userForm.controls.email.setValue(this.user.email);
        this.userForm.controls.phoneNumber.setValue(this.user.phoneNumber);
        this.userForm.controls.function.setValue(this.user.function);
    }

    private getLinkedProjects(): Promise<Project>[] {
        const projectPromise = [];
        this.user.projectsId.forEach((projectId) => {
            projectPromise.push(this.projectService.getProject(projectId));
        });
        return projectPromise;
    }

}
