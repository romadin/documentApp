import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { forkJoin } from 'rxjs';
import { animate, keyframes, style, transition, trigger } from '@angular/animations';

import { Chapter } from '../../../../../shared/packages/chapter-package/chapter.model';
import { ChapterService } from '../../../../../shared/packages/chapter-package/chapter.service';
import { WorkFunctionService } from '../../../../../shared/packages/work-function-package/work-function.service';
import { WorkFunction } from '../../../../../shared/packages/work-function-package/work-function.model';
import {
    WorkFunctionUpdateBody
} from '../../../../../shared/packages/work-function-package/interface/work-function-api-response.interface';

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
    @Output() closeView: EventEmitter<boolean> = new EventEmitter<boolean>();
    chapters: Chapter[];
    chaptersSelected;

    constructor(private chapterService: ChapterService, private workFunctionService: WorkFunctionService) { }

    ngOnInit() {
        const workFunctions = this.parent.template.workFunctions.filter(w => w.id !== this.parent.id);
        const observables = [];
        workFunctions.forEach((workFunction) => observables.push(this.chapterService.getChaptersByWorkFunction(workFunction)));
        forkJoin(observables).subscribe((chaptersContainer: Chapter[][]) => {
            this.chapters = [];
            chaptersContainer.forEach(chapters => this.chapters = this.chapters.concat(chapters));
            this.filterExistingChapters();
        });
    }

    submit(e: Event): void {
        e.preventDefault();
        if (this.chaptersSelected && this.chaptersSelected.length > 0) {
            const body: WorkFunctionUpdateBody = {
                chapters: this.chaptersSelected
            };
            this.workFunctionService.updateWorkFunction(this.parent, body).subscribe();
        }
    }

    onCloseView(e: Event): void {
        e.stopPropagation();
        e.preventDefault();
        this.closeView.emit(true);
    }

    private filterExistingChapters(): void {
        // remove duplicates
        this.chapters = this.chapters.filter((chapters, pos) => {
            const index = this.chapters.findIndex(c => c.id === chapters.id);
            return index === pos;
        });

        // remove already linked chapters
        this.parent.chapters.map((currentChapter) => {
            const index = this.chapters.findIndex(newChapter => newChapter.id === currentChapter.id);
            if (index !== undefined) {
                this.chapters.splice(index, 1);
            }
        });
    }
}
