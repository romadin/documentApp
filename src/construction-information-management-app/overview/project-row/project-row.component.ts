import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';

import { Project } from '../../../shared/packages/project-package/project.model';
import { ProjectService } from '../../../shared/packages/project-package/project.service';
import { User } from '../../../shared/packages/user-package/user.model';
import { UserService } from '../../../shared/packages/user-package/user.service';
import { ProjectPopupComponent } from '../../popups/project-popup/project-popup.component';

@Component({
    selector: 'cim-project-row',
    templateUrl: './project-row.component.html',
    styleUrls: ['./project-row.component.css']
})
export class ProjectRowComponent implements OnInit {
    @Input() project: Project;
    public currentUser: User;

    constructor(public dialog: MatDialog,
                private projectService: ProjectService,
                private userService: UserService) { }

    ngOnInit() {
        this.userService.getCurrentUser().subscribe((user: User) => {
            this.currentUser = user;
        });
    }

    public editProject(event: MouseEvent, id: number): void {
        event.preventDefault();
        event.stopPropagation();
        this.dialog.open(ProjectPopupComponent, {
            width: '400px',
            data: {
                title: 'Wijzig project ' + this.project.getName(),
                placeHolder: this.project.getName(),
                submitButton: 'Wijzig',
                id: id }
        });
    }

    public deleteProject(event: MouseEvent, id: number): void {
        event.preventDefault();
        event.stopPropagation();
        this.projectService.deleteProject(id);
    }

    public userViewProject(): boolean {
        if (this.currentUser.isAdmin()) {
            return true;
        }

        const hasProjectId: number | undefined = this.currentUser.projectsId.find((projectId) => {
            return projectId === this.project.getId();
        });

        return !!hasProjectId;
    }
}
