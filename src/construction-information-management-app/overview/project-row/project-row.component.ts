import { Component, Input, OnInit } from '@angular/core';
import { Project } from '../../../shared/packages/project-package/project.model';

@Component({
    selector: 'cim-project-row',
    templateUrl: './project-row.component.html',
    styleUrls: ['./project-row.component.css']
})
export class ProjectRowComponent implements OnInit {
    @Input() project: Project;

    constructor() { }

    ngOnInit() {
    }

}
