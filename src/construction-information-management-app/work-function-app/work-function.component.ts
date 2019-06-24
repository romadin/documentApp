import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProjectService } from '../../shared/packages/project-package/project.service';

import { WorkFunction } from '../../shared/packages/work-function-package/work-function.model';
import { RouterService } from '../../shared/service/router.service';
import { FolderService } from '../../shared/packages/folder-package/folder.service';
import { Folder } from '../../shared/packages/folder-package/folder.model';
import { DocumentService } from '../../shared/packages/document-package/document.service';
import { Document } from '../../shared/packages/document-package/document.model';
import { UserService } from '../../shared/packages/user-package/user.service';
import { User } from '../../shared/packages/user-package/user.model';

@Component({
  selector: 'cim-work-function',
  templateUrl: './work-function.component.html',
  styleUrls: ['./work-function.component.css']
})
export class WorkFunctionComponent implements OnInit {
    documents: Document[];
    workFunction: WorkFunction;
    mainFunction: WorkFunction;
    currentUser: User;
    items: (Document | Folder)[];

    constructor(private folderService: FolderService,
                private documentService: DocumentService,
                private userService: UserService,
                private projectService: ProjectService,
                private activatedRoute: ActivatedRoute,
                private routerService: RouterService,
    ) { }

    ngOnInit() {
        const workFunctionId: number = parseInt(this.activatedRoute.snapshot.paramMap.get('id'), 10);
        const projectId: number = parseInt(location.pathname.split('/')[2], 10);
        this.projectService.getProject(projectId, this.activatedRoute.snapshot.data.organisation).subscribe(project => {
            this.workFunction = project.workFunctions.find(w => w.id === workFunctionId);

            this.workFunction.items.subscribe(items => this.items = items );
            this.mainFunction = project.workFunctions.find(w => w.isMainFunction);
        });

        this.routerService.setBackRouteParentFromActivatedRoute(this.activatedRoute.parent);

        this.userService.getCurrentUser().subscribe((user: User) => {
            this.currentUser = user;
        });
    }
}
