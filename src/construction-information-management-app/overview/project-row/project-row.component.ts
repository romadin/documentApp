import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';

import { Project } from '../../../shared/packages/project-package/project.model';
import { ProjectService } from '../../../shared/packages/project-package/project.service';
import { ProjectPopupComponent } from '../../popups/project-popup/project-popup.component';

@Component({
    selector: 'cim-project-row',
    templateUrl: './project-row.component.html',
    styleUrls: ['./project-row.component.css']
})
export class ProjectRowComponent implements OnInit {
    @Input() project: Project;

    constructor(public dialog: MatDialog,
                private projectService: ProjectService) { }

    ngOnInit() {
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


}
