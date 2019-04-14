import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { User } from '../../../../../shared/packages/user-package/user.model';
import { Project } from '../../../../../shared/packages/project-package/project.model';

@Component({
    selector: 'cim-user-detail-public',
    templateUrl: './user-detail-public.component.html',
    styleUrls: ['./user-detail-public.component.css']
})
export class UserDetailPublicComponent implements OnInit {
    @Input() user: User;
    @Input() projects: Project[];
    @Input() imageSrc: string;
    @Output() closeView: EventEmitter<boolean> = new EventEmitter<boolean>();

    constructor() {}

    ngOnInit() {
        this.projects = this.projects.filter(project => this.user.projectsId.find(projectId => projectId === project.getId()));
    }

    onCloseDetailView(e: Event): void {
        this.closeView.emit(true);
    }

}
