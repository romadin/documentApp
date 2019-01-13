import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ProjectService } from '../../shared/packages/project-package/project.service';
import { Project } from '../../shared/packages/project-package/project.model';

@Component({
    selector: 'cim-project-detail',
    templateUrl: './project-detail.component.html',
    styleUrls: ['./project-detail.component.css']
})

export class ProjectDetailComponent implements OnInit {
    public project: Project;
    private projectService: ProjectService;
    private router: Router;

    constructor(projectService: ProjectService, router: Router, private activatedRoute: ActivatedRoute) {
        this.projectService = projectService;
        this.router = router;
    }

    ngOnInit() {
        this.activatedRoute.params.subscribe(params => {
            this.projectService.getProject(params['id']).then(project => {
                this.project = project;
            });
        });
    }

}
