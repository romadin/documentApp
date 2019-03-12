import { Component, OnInit } from '@angular/core';
import { ProjectService } from '../../../../shared/packages/project-package/project.service';
import { Project } from '../../../../shared/packages/project-package/project.model';

@Component({
  selector: 'cim-projecten',
  templateUrl: './projects-list.component.html',
  styleUrls: ['./projects-list.component.css']
})
export class ProjectsListComponent implements OnInit {
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
