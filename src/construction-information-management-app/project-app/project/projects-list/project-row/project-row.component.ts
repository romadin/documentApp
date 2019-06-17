import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute } from '@angular/router';

import { Project } from '../../../../../shared/packages/project-package/project.model';
import { ProjectService } from '../../../../../shared/packages/project-package/project.service';
import { User } from '../../../../../shared/packages/user-package/user.model';
import { UserService } from '../../../../../shared/packages/user-package/user.service';
import { DefaultPopupData, ProjectPopupComponent } from '../../../../popups/project-popup/project-popup.component';
import { Organisation } from '../../../../../shared/packages/organisation-package/organisation.model';
import { ConfirmPopupComponent, ConfirmPopupData } from '../../../../popups/confirm-popup/confirm-popup.component';
import { ToastService } from '../../../../../shared/toast.service';

@Component({
    selector: 'cim-project-row',
    templateUrl: './project-row.component.html',
    styleUrls: ['./project-row.component.css']
})
export class ProjectRowComponent implements OnInit {
    @Input() project: Project;
    public currentUser: User;
    private currentOrganisation: Organisation;

    constructor(public dialog: MatDialog,
                private projectService: ProjectService,
                private userService: UserService,
                private activatedRoute: ActivatedRoute,
                private toast: ToastService
    ) { }

    ngOnInit() {
        this.currentOrganisation = <Organisation>this.activatedRoute.snapshot.data.organisation;
        this.userService.getCurrentUser().subscribe((user: User) => {
            this.currentUser = user;
        });
    }

    public editProject(event: MouseEvent, id: number): void {
        event.preventDefault();
        event.stopPropagation();
        const data: DefaultPopupData = {
            title: 'Wijzig projectId ' + this.project.name,
            placeholder: this.project.name,
            submitButton: 'Wijzigen',
            id: id,
            organisation: this.currentOrganisation,
        };

        this.dialog.open(ProjectPopupComponent, {
            width: '400px',
            data: data
        });
    }

    public deleteProject(event: MouseEvent, id: number): void {
        event.preventDefault();
        event.stopPropagation();
        const popupData: ConfirmPopupData = {
            title: 'Project verwijderen',
            name: this.project.name,
            action: 'verwijderen'
        };
        this.dialog.open(ConfirmPopupComponent, {width: '400px', data: popupData}).afterClosed().subscribe((action) => {
            if (action) {
                this.projectService.deleteProject(id, this.currentOrganisation);
                this.toast.showSuccess('Project: ' + this.project.name + ' is verwijderd', 'Verwijderd');
            }
        });
    }

    public userViewProject(): boolean {
        if (this.currentUser.isAdmin()) {
            return true;
        }

        const hasProjectId: number | undefined = this.currentUser.projectsId.find((projectId) => {
            return projectId === this.project.id;
        });

        return !!hasProjectId;
    }
}
