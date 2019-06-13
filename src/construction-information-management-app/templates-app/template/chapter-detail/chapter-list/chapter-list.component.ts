import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { animate, keyframes, style, transition, trigger } from '@angular/animations';
import { combineLatest } from 'rxjs';

import { Chapter } from '../../../../../shared/packages/chapter-package/chapter.model';
import { ChapterService } from '../../../../../shared/packages/chapter-package/chapter.service';
import { WorkFunctionService } from '../../../../../shared/packages/work-function-package/work-function.service';
import { WorkFunction } from '../../../../../shared/packages/work-function-package/work-function.model';
import {
    WorkFunctionUpdateBody
} from '../../../../../shared/packages/work-function-package/interface/work-function-api-response.interface';
import { ToastService } from '../../../../../shared/toast.service';

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
    chaptersSelected: Chapter[];

    constructor(private chapterService: ChapterService, private workFunctionService: WorkFunctionService, private toast: ToastService) { }

    ngOnInit() {
        const workFunctions = this.parent.parent.workFunctions.filter(w => w.id !== this.parent.id);
        const observables = [];
        workFunctions.forEach((workFunction) => observables.push(workFunction.chapters));
        combineLatest(observables).subscribe((chaptersContainer: Chapter[][]) => {
            this.chapters = [];
            chaptersContainer.forEach(chapters => this.chapters = this.chapters.concat(chapters));
            this.filterExistingChapters();
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
            this.workFunctionService.updateWorkFunction(this.parent, body).subscribe(() => {
                let chapters = this.parent.chapters.getValue();
                chapters = chapters.concat(this.chaptersSelected);
                this.parent.chapters.next(chapters);
                console.log(this.parent.chapters.getValue());
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

    private filterExistingChapters(): void {
        // remove duplicates
        this.chapters = this.chapters.filter((chapters, pos) => {
            const index = this.chapters.findIndex(c => c.id === chapters.id);
            return index === pos;
        });

        const chaptersFromParent = this.parent.chapters.getValue();
        // remove already linked chapters
        chaptersFromParent.map((currentChapter) => {
            const index = this.chapters.findIndex(newChapter => newChapter.id === currentChapter.id);
            if (index !== -1) {
                this.chapters.splice(index, 1);
            }
        });
    }
}
