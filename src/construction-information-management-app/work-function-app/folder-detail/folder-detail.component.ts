import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { animate, keyframes, style, transition, trigger } from '@angular/animations';

import { User } from '../../../shared/packages/user-package/user.model';
import { Company } from '../../../shared/packages/company-package/company.model';
import { Document } from '../../../shared/packages/document-package/document.model';
import { WorkFunction } from '../../../shared/packages/work-function-package/work-function.model';

export interface ActiveItemPackage {
    component: string;
    item: Document | null;
    mainFunction?: WorkFunction;
    parent?: WorkFunction | Document | Company;
}

@Component({
    selector: 'cim-folder-detail',
    templateUrl: './folder-detail.component.html',
    styleUrls: ['./folder-detail.component.css'],
    animations: [
        trigger('fadeIn', [
            transition('void => *', [
                style({ opacity: '0', }),
                animate('250ms 250ms', style({ opacity: '1' })),
            ]),
            transition('* => void', [
                animate('250ms', keyframes([
                    style({ opacity: '0' })
                ])),
            ])
        ]),
    ]
})
export class FolderDetailComponent implements OnInit, OnDestroy {
    @ViewChild('container') container: ElementRef;
    @Input() workFunction: WorkFunction;
    @Input() currentUser: User;
    @Output() closeView: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output() itemsAdded: EventEmitter<WorkFunction | Document> = new EventEmitter<WorkFunction | Document>();
    addFixedClass = false;
    projectId: number;
    private _activeItem: ActiveItemPackage;

    constructor(private changeDetection: ChangeDetectorRef) { }

    @Input()
    set activeSidePackage(activeItem: ActiveItemPackage) {
        this._activeItem = activeItem;
    }

    get activeItem(): ActiveItemPackage {
        return this._activeItem;
    }

    ngOnInit() {
        this.projectId = parseInt(location.pathname.split('/')[2], 10);
    }
    ngOnDestroy() {
        this.changeDetection.detach();
    }

    onItemsAdded(item: WorkFunction| Document) {
        this.itemsAdded.emit(item);
        this._activeItem = undefined;
        this.closeView.emit(true);
    }


    onCloseView(close: boolean): void {
        this._activeItem = undefined;
        this.closeView.emit(close);
    }
}
