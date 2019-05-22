import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { FolderService } from '../../../../shared/packages/folder-package/folder.service';
import { Folder } from '../../../../shared/packages/folder-package/folder.model';
import { UserService } from '../../../../shared/packages/user-package/user.service';
import { User } from '../../../../shared/packages/user-package/user.model';
import { RouterService } from '../../../../shared/service/router.service';

@Component({
    selector: 'cim-project-detail',
    templateUrl: './project-detail.component.html',
    styleUrls: ['./project-detail.component.css']
})

export class ProjectDetailComponent implements OnInit {
    public folders: Folder[];
    public currentUser: User;
    public folderUrlToRedirect: string;
    public projectId: number;

    constructor(private activatedRoute: ActivatedRoute,
                private folderService: FolderService,
                private userService: UserService,
                private routerService: RouterService) {
        this.folderUrlToRedirect = 'folder/';
    }

    ngOnInit() {
        this.routerService.setBackRoute('/projecten');
        this.projectId = parseInt(this.activatedRoute.snapshot.paramMap.get('id'), 10);

        this.userService.getCurrentUser().subscribe((user: User) => {
            this.currentUser = user;
        });
        this.folderService.getFoldersByProject(this.projectId).subscribe(folders => {
            folders = folders.sort((a, b) => a.order - b.order);
            this.folders = folders;
        });
    }

}
