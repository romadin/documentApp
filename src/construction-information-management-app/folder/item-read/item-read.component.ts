import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Folder } from '../../../shared/packages/folder-package/folder.model';
import { Document } from '../../../shared/packages/document-package/document.model';
import { Project } from '../../../shared/packages/project-package/project.model';
import { Router } from '@angular/router';
import { ProjectService } from '../../../shared/packages/project-package/project.service';

@Component({
  selector: 'cim-item-read',
  templateUrl: './item-read.component.html',
  styleUrls: ['./item-read.component.css']
})
export class ItemReadComponent implements OnInit {
    @Input() items: (Folder | Document)[];
    @Output() closeReadMode: EventEmitter<boolean> = new EventEmitter<boolean>();
    project: Project;

    constructor(private router: Router,
                private projectService: ProjectService) {
        const projectId = parseInt(this.router.url.split('/')[2], 10);

        this.projectService.getProject(projectId).then((project: Project) => {
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
