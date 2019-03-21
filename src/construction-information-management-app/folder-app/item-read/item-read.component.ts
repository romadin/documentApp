import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Project } from '../../../shared/packages/project-package/project.model';
import { ProjectService } from '../../../shared/packages/project-package/project.service';
import { Folder } from '../../../shared/packages/folder-package/folder.model';
import { Document } from '../../../shared/packages/document-package/document.model';
import { Organisation } from '../../../shared/packages/organisation-package/organisation.model';

@Component({
  selector: 'cim-item-read',
  templateUrl: './item-read.component.html',
  styleUrls: ['./item-read.component.css']
})
export class ItemReadComponent implements OnInit {
    @Input() items: (Folder | Document)[];
    @Output() closeReadMode: EventEmitter<boolean> = new EventEmitter<boolean>();
    project: Project;
    private organisation: Organisation;

    constructor(private router: Router,
                private projectService: ProjectService,
                private activatedRoute: ActivatedRoute) {
        this.organisation = <Organisation>this.activatedRoute.snapshot.data.organisation;
        const projectId = parseInt(this.router.url.split('/')[2], 10);

        this.projectService.getProject(projectId, this.organisation).then((project: Project) => {
            this.project = project;
        });
    }

    ngOnInit() {
    }

    close(e: Event) {
        e.stopPropagation();
        e.preventDefault();
        this.closeReadMode.emit(true);
    }

    checkItemIsFolder(item): boolean {
        return item instanceof Folder;
    }

}
