import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Organisation } from '../../../../../shared/packages/organisation-package/organisation.model';

import { Project } from '../../../../../shared/packages/project-package/project.model';
import { User } from '../../../../../shared/packages/user-package/user.model';
import { WorkFunction } from '../../../../../shared/packages/work-function-package/work-function.model';
import { WorkFunctionService } from '../../../../../shared/packages/work-function-package/work-function.service';

@Component({
    selector: 'cim-project-work-function',
    templateUrl: './project-work-function.component.html',
    styleUrls: ['./project-work-function.component.css']
})
export class ProjectWorkFunctionComponent implements OnInit {
    @Input() parent: Project;
    @Input() workFunction: WorkFunction;
    @Input() currentUser: User;
    @Input() redirectUrl: string;
    @Output() editWorkFunction: EventEmitter<WorkFunction> = new EventEmitter<WorkFunction>();
    private editableFolders = ['BIM Regisseur', 'BIM Manager'];
    private timerId: number;
    private organisation: Organisation;

    constructor(private workFunctionService: WorkFunctionService, private router: Router, private activatedRoute: ActivatedRoute) { }

    ngOnInit() {
        this.organisation = this.activatedRoute.snapshot.parent.parent.parent.data.organisation
    }

    workFunctionEditable(): boolean {
        const folder = this.editableFolders.find( (folderName) => {
            return folderName === this.workFunction.name;
        });
        return folder !== undefined;
    }

    toggleOn(e: MouseEvent, turnOn: boolean): void {
        e.preventDefault();
        e.stopPropagation();
        this.workFunction.on = turnOn;

        if (this.timerId) {
            clearTimeout(this.timerId);
        }
        this.timerId = setTimeout(() => {
            this.workFunctionService.updateWorkFunction(this.workFunction, {on: turnOn}).subscribe();
        }, 500);
    }

    redirectToModule(e: MouseEvent): void {
        e.preventDefault();
        e.stopPropagation();

        if (this.organisation.modules.find(module => module.id === 2) && !this.workFunction.isMainFunction) {
            this.router.navigate(['functies', this.workFunction.id, 'bedrijven'], {relativeTo: this.activatedRoute});
        } else {
            this.router.navigate(['functies', this.workFunction.id], {relativeTo: this.activatedRoute});
        }
    }

    onEditWorkFunction(e: Event): void {
        e.preventDefault();
        e.stopPropagation();
        this.editWorkFunction.emit(this.workFunction);
    }

    deleteWorkFunction(e: Event): void {
        e.preventDefault();
        e.stopPropagation();
        this.workFunctionService.deleteWorkFunction(this.workFunction, this.parent).subscribe();
    }
}
