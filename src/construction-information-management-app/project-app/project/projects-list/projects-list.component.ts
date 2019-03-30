import { Component, OnInit } from '@angular/core';
import { ProjectService } from '../../../../shared/packages/project-package/project.service';
import { Project } from '../../../../shared/packages/project-package/project.model';
import { ActivatedRoute } from '@angular/router';
import { Organisation } from '../../../../shared/packages/organisation-package/organisation.model';
import { LoadingService } from '../../../../shared/loading.service';

@Component({
  selector: 'cim-projecten',
  templateUrl: './projects-list.component.html',
  styleUrls: ['./projects-list.component.css']
})
export class ProjectsListComponent implements OnInit {
    public projects: Project[];

    constructor(
        private projectService: ProjectService,
        private activatedRoute: ActivatedRoute,
        private loadingService: LoadingService,
    ) {
        this.loadingService.isLoading.next(true);
    }

    ngOnInit() {
        const organisation = <Organisation>this.activatedRoute.snapshot.data.organisation;
        this.projectService.getProjects(organisation).subscribe((projects: Project[]) => {
            this.loadingService.isLoading.next(false);
            this.projects = projects;
        });
    }

}