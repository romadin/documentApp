import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { FolderService } from '../../shared/packages/folder-package/folder.service';
import { Folder } from '../../shared/packages/folder-package/folder.model';
import { UserService } from '../../shared/packages/user-package/user.service';
import { User } from '../../shared/packages/user-package/user.model';

@Component({
    selector: 'cim-project-detail',
    templateUrl: './project-detail.component.html',
    styleUrls: ['./project-detail.component.css']
})

export class ProjectDetailComponent implements OnInit {
    public folders: Folder[];
    public currentUser: User;
    public folderUrlToRedirect: string;

    constructor(private router: Router,
                private activatedRoute: ActivatedRoute,
                private folderService: FolderService,
                private userService: UserService) {
        this.folderUrlToRedirect = '/folder/';
    }

    ngOnInit() {
        const projectId = this.activatedRoute.snapshot.paramMap.get('id');

        this.userService.getCurrentUser().subscribe((user: User) => {
            this.currentUser = user;
        });
        this.folderService.getFoldersByProject(parseInt(projectId, 10)).subscribe(folders => {
            this.folders = folders;
        });
    }

}
