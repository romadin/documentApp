import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonToggleChange } from '@angular/material';

import { Chapter } from '../../../../shared/packages/chapter-package/chapter.model';
import { WorkFunction } from '../../../../shared/packages/work-function-package/work-function.model';
import { isWorkFunction } from '../../../../shared/packages/work-function-package/interface/work-function.interface';

export interface ChapterPackage {
    chapter: Chapter;
    parent: WorkFunction | Chapter;
}
export type AddType = 'new' | 'exist';

@Component({
  selector: 'cim-chapter-detail',
  templateUrl: './chapter-detail.component.html',
  styleUrls: ['./chapter-detail.component.css']
})
export class ChapterDetailComponent {
    @Input() parent: WorkFunction | Chapter;
    @Input() chapter: Chapter;
    @Output() closeView: EventEmitter<boolean> = new EventEmitter<boolean>();
    view: AddType = 'exist';

    constructor() { }

    onCloseView(close: boolean): void {
        if (close) {
            this.closeView.emit(close);
        }
    }

    checkParentIsWorkFunction(): WorkFunction | null {
        return isWorkFunction(this.parent) ? this.parent : null;
    }
}
