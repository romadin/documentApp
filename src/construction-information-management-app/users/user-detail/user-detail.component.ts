import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { User } from '../../../shared/packages/user-package/user.model';
import { FormControl, FormGroup } from '@angular/forms';
import { ProjectService } from '../../../shared/packages/project-package/project.service';
import { Project } from '../../../shared/packages/project-package/project.model';
import { UserService } from '../../../shared/packages/user-package/user.service';

@Component({
  selector: 'cim-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css']
})
export class UserDetailComponent implements OnInit {
    @Input() user: User;
    @Output() closeDetailView: EventEmitter<boolean> = new EventEmitter<boolean>();

    public projects: Project[];
    public userForm: FormGroup = new FormGroup({
        firstName: new FormControl(''),
        insertion: new FormControl(''),
        lastName: new FormControl(''),
        email: new FormControl(''),
        function: new FormControl(''),
    });
    constructor(private projectService: ProjectService, private userService: UserService) { }

    ngOnInit() {
        Promise.all(this.getLinkedProjects()).then((projects) => {
            this.projects = projects;
        });
        this.setFormValue();
    }

    public onCloseDetailView() {
        this.closeDetailView.emit(true);
    }

    public onSubmit() {
        const data = {
            firstName: this.userForm.controls.firstName.value,
            insertion: this.userForm.controls.insertion.value,
            lastName: this.userForm.controls.lastName.value,
            email: this.userForm.controls.email.value,
            function: this.userForm.controls.function.value,
        };
        this.userService.editUser(this.user, data).subscribe((value) => {
            this.onCloseDetailView();
        });
    }

    private setFormValue() {
        this.userForm.controls.firstName.setValue(this.user.firstName);
        this.userForm.controls.insertion.setValue(this.user.insertion);
        this.userForm.controls.lastName.setValue(this.user.lastName);
        this.userForm.controls.email.setValue(this.user.email);
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
