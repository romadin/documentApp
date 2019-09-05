import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

import { Headline } from '../../../../shared/packages/headline-package/headline.model';
import { HeadlineService } from '../../../../shared/packages/headline-package/headline.service';
import { Chapter } from '../../../../shared/packages/chapter-package/chapter.model';
import { ChapterService } from '../../../../shared/packages/chapter-package/chapter.service';
import { WorkFunction } from '../../../../shared/packages/work-function-package/work-function.model';
import { ToastService } from '../../../../shared/toast.service';

import { ChapterPackage } from '../chapter-detail/chapter-detail.component';
import { ConfirmPopupComponent, ConfirmPopupData } from '../../../popups/confirm-popup/confirm-popup.component';

export interface HeadlinePackage {
    headline: Headline;
    parent: WorkFunction;
}

@Component({
  selector: 'cim-headline',
  templateUrl: './headline.component.html',
  styleUrls: ['./headline.component.css']
})
export class HeadlineComponent implements OnInit {
    @Input() headline: Headline;
    @Input() workFunction: WorkFunction;
    @Output() editHeadline: EventEmitter<HeadlinePackage> = new EventEmitter<HeadlinePackage>();
    @Output() editChapter: EventEmitter<ChapterPackage> = new EventEmitter<ChapterPackage>();
    @Output() addChapter: EventEmitter<Headline> = new EventEmitter<Headline>();
    chapters: Chapter[];

    constructor(private dialog: MatDialog,
                private headlineService: HeadlineService,
                private chapterService: ChapterService,
                private toast: ToastService
    ) { }

    ngOnInit() {
        this.headline.chapters.subscribe(chapters => {
            this.chapters = chapters;
        });
    }

    deleteHeadline(event: Event) {
        event.stopPropagation();
        const popupData: ConfirmPopupData = {
            title: 'Kop verwijderen',
            name: this.headline.name,
            message: `Weet u zeker dat u <strong>${this.headline.name}</strong> wilt verwijderen`,
            firstButton: 'ja',
            secondButton: 'nee'
        };
        this.dialog.open(ConfirmPopupComponent, {width: '400px', data: popupData}).afterClosed().subscribe((action) => {
            if (action) {
                this.headlineService.deleteHeadline(this.headline, this.workFunction).subscribe(() => {
                    const headlines: Headline[] = this.workFunction.headlines.getValue();
                    headlines.splice(headlines.findIndex(h => h.id === this.headline.id), 1);
                    this.workFunction.headlines.next(headlines);
                    this.toast.showSuccess('Functie: ' + this.headline.name + ' is verwijderd', 'Verwijderd');
                });
            }
        });
    }

    onEditHeadline(event: Event) {
        event.stopPropagation();
        const headlinePackage: HeadlinePackage = {
            headline: this.headline,
            parent: this.workFunction
        };
        this.editHeadline.emit(headlinePackage);
    }

    onAddChapter(e: Event) {
        e.stopPropagation();
        this.addChapter.emit(this.headline);
    }

    onChapterClick(chapterPackage: ChapterPackage): void {
        this.editChapter.emit(chapterPackage);
    }

    drop(event: CdkDragDrop<string[]>) {
        moveItemInArray(this.headline.chapters.getValue(), event.previousIndex, event.currentIndex);
        const chapter = event.item.data;
        // this.chapterService.updateChapter(chapter, {order: event.currentIndex + 1}, {}, this.headline).subscribe((value) => {
        //     event.item.data = value;
        // });
    }
}
