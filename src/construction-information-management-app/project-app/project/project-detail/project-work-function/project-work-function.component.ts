import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

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

    constructor(private workFunctionService: WorkFunctionService) { }

    ngOnInit() {
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
