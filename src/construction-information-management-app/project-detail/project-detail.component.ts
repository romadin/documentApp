import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ProjectService } from '../../shared/packages/project-package/project.service';
import { Folder } from '../../shared/packages/folder-package/folder.model';
import { FolderService } from '../../shared/packages/folder-package/folder.service';

@Component({
    selector: 'cim-project-detail',
    templateUrl: './project-detail.component.html',
    styleUrls: ['./project-detail.component.css']
})

export class ProjectDetailComponent implements OnInit {
    public folders: Folder[];

    constructor(projectService: ProjectService,
                router: Router,
                private activatedRoute: ActivatedRoute,
                private folderService: FolderService ) { }

    ngOnInit() {
        this.activatedRoute.params.subscribe(params => {
            this.folderService.getFoldersByProject(parseInt(params.id, 10)).subscribe(folders => {
                console.log(folders);
                this.folders = folders;
            });
        });
    }

}
