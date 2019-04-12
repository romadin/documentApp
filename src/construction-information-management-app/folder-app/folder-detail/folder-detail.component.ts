import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { animate, keyframes, style, transition, trigger } from '@angular/animations';

import { User } from '../../../shared/packages/user-package/user.model';
import { Document } from '../../../shared/packages/document-package/document.model';
import { Folder } from '../../../shared/packages/folder-package/folder.model';

export interface ActiveItemPackage {
    component: string;
    item: Folder | Document | null;
}

@Component({
    selector: 'cim-folder-detail',
    templateUrl: './folder-detail.component.html',
    styleUrls: ['./folder-detail.component.css'],
    animations: [
        trigger('fadeIn', [
            transition('void => *', [
                style({ opacity: '0', }),
                animate('250ms', style({ opacity: '1' })),
            ]),
            transition('* => void', [
                animate('250ms', keyframes([
                    style({ opacity: '0' })
                ])),
            ])
        ]),
    ]
})
export class FolderDetailComponent implements OnInit {
    @Input() currentFolder: Folder;
    @Input() currentUser: User;
    @Output() closeView: EventEmitter<boolean> = new EventEmitter<boolean>();
    private _activeItem: ActiveItemPackage;

    constructor() { }

    @Input()
    set activeSidePackage(activeItem: ActiveItemPackage) {
        this._activeItem = activeItem;
    }

    get activeItem(): ActiveItemPackage {
        return this._activeItem;
    }

    ngOnInit() {

    }

    onCloseView(close: boolean): void {
        this._activeItem = undefined;
        this.closeView.emit(close);
    }
}
