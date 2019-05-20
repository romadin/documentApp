import { Component, EventEmitter, Input, Output } from '@angular/core';
import { animate, keyframes, style, transition, trigger } from '@angular/animations';
import { MatButtonToggleChange } from '@angular/material';

import { WorkFunction } from '../../../../shared/packages/work-function-package/work-function.model';
import { Headline } from '../../../../shared/packages/headline-package/headline.model';
import { AddType } from '../chapter-detail/chapter-detail.component';

@Component({
    selector: 'cim-headline-detail',
    templateUrl: './headline-detail.component.html',
    styleUrls: ['./headline-detail.component.css'],
    animations: [
        trigger('toggleInView', [
            transition('void => *', [
                style({ opacity: '0'}),
                animate('250ms cubic-bezier(0.0, 0.0, 0.2, 1)', style({ opacity: '1'})),
            ]),
            transition('* => void', [
                animate('250ms cubic-bezier(0.0, 0.0, 0.2, 1)', keyframes([
                    style({ opacity: '0'})
                ])),
            ])
        ])
    ]
})
export class HeadlineDetailComponent {
    @Input() workFunction: WorkFunction;
    @Input() headline: Headline;
    @Output() closeView: EventEmitter<boolean> = new EventEmitter<boolean>();
    view: AddType = 'exist';

    constructor() { }

    onCloseView(): void {
        this.closeView.emit(true);
    }

    changeEditItemForm(e: MatButtonToggleChange, type: AddType) {
        this.view = type;
    }
}
