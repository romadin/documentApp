import { animate, keyframes, state, style, transition, trigger } from '@angular/animations';
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
    styleUrls: ['./project-detail.component.css'],
    animations: [
        trigger('toggleInView', [
            state('close', style({
                transform: 'translateX(110%)'
            })),
            state('open', style({
                width: '48%',
                transform: 'translateX(0)'
            })),
            transition('close => open', [
                animate('300ms cubic-bezier(0.0, 0.0, 0.2, 1)')
            ]),
            transition('open => close', [
                animate('300ms cubic-bezier(0.0, 0.0, 0.2, 1)', keyframes([
                    style({ transform: 'translateX(5%)', offset: 0.1}),
                    style({ transform: 'translateX(10%)', offset: 0.8}),
                    style({ transform: 'translateX(110%)', offset: 1}),
                ]))
            ]),
            transition('void => *', [
                style({ opacity: '0'}),
                animate('100ms cubic-bezier(0.0, 0.0, 0.2, 1)', style({ opacity: '1'})),
            ]),
            transition('* => void', [
                animate('100ms cubic-bezier(0.0, 0.0, 0.2, 1)', keyframes([
                    style({ opacity: '0'})
                ])),
            ])
        ]),
        trigger('resizeWidth', [
            state('fullWidth', style({
                width: '100%'
            })),
            state('smallWidth', style({
                width: '50%'
            })),
            transition('fullWidth <=> smallWidth', [
                animate('350ms cubic-bezier(0.0, 0.0, 0.2, 1)')
            ]),
        ])
    ]
})

export class ProjectDetailComponent implements OnInit {
    folders: Folder[];
    currentUser: User;
    folderUrlToRedirect: string;
    projectId: number;
    showFunctionDetail = false;

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
