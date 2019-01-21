import { Component, OnInit } from '@angular/core';
import { ProjectService } from '../../shared/packages/project-package/project.service';
import { Project } from '../../shared/packages/project-package/project.model';

@Component({
  selector: 'cim-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css']
})
export class OverviewComponent implements OnInit {
    public projects: Project[];
    private projectService: ProjectService;

    constructor(projectService: ProjectService) {
        this.projectService = projectService;
    }

    ngOnInit() {
        this.projectService.getProjects().subscribe((projects: Project[]) => {
            this.projects = projects;
        });
    }

}
