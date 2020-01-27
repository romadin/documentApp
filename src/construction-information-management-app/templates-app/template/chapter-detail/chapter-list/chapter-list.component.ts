import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { animate, keyframes, style, transition, trigger } from '@angular/animations';

import { Chapter } from '../../../../../shared/packages/chapter-package/chapter.model';
import { ChapterService } from '../../../../../shared/packages/chapter-package/chapter.service';
import { WorkFunctionService } from '../../../../../shared/packages/work-function-package/work-function.service';
import { WorkFunction } from '../../../../../shared/packages/work-function-package/work-function.model';
import {
    WorkFunctionUpdateBody
} from '../../../../../shared/packages/work-function-package/interface/work-function-api-response.interface';
import { ToastService } from '../../../../../shared/toast.service';
import { combineLatest } from 'rxjs';

@Component({
    selector: 'cim-chapter-list',
    templateUrl: './chapter-list.component.html',
    styleUrls: ['./chapter-list.component.css'],
    animations: [
        trigger('toggleInView', [
            transition('void => *', [
                style({ opacity: '0'}),
                animate('300ms cubic-bezier(0.0, 0.0, 0.2, 1)', style({ opacity: '1'})),
            ]),
            transition('* => void', [
                animate('300ms cubic-bezier(0.0, 0.0, 0.2, 1)', keyframes([
                    style({ opacity: '0'})
                ])),
            ])
        ])
    ]
})
export class ChapterListComponent implements OnInit {
    @Input() parent: WorkFunction;
    @Input() mainWorkFunction: WorkFunction;
    @Output() closeView: EventEmitter<boolean> = new EventEmitter<boolean>();
    chapters: Chapter[];
    chaptersSelected: Chapter[];

    constructor(private chapterService: ChapterService, private workFunctionService: WorkFunctionService, private toast: ToastService) { }

    ngOnInit() {

        combineLatest(this.parent.chapters, this.mainWorkFunction.chapters).subscribe(([items, mainWorkFunctionItems]) => {
            this.chapters = mainWorkFunctionItems.filter(mainWorkFunctionItem => {
                return !items.find(item => item.id === mainWorkFunctionItem.id);
            });
        });
    }

    submit(e: Event): void {
        e.preventDefault();
        if (this.chaptersSelected && this.chaptersSelected.length > 0) {
            const selectedChaptersId: number[] = this.chaptersSelected.map(chapter => chapter.id);
            const body: WorkFunctionUpdateBody = {
                chapters: selectedChaptersId
            };
            const message = this.chaptersSelected.length === 1 ?
                'Hoofdstuk: ' + this.chapters[0].name + ' is toegevoegd' : 'De hoofdstukken zijn toegevoegd';

            this.chapterService.postChapters(<{chapters: number[]}>body, {workFunctionId: this.parent.id}, this.parent).subscribe(() => {
                this.toast.showSuccess(message, 'Toegevoegd');
                this.onCloseView(e);
            });
        }
    }

    onCloseView(e: Event): void {
        e.stopPropagation();
        e.preventDefault();
        this.closeView.emit(true);
    }
}
