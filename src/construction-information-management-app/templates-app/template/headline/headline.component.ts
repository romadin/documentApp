import { Component, ElementRef, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Headline } from '../../../../shared/packages/headline-package/headline.model';
import { ChapterPackage } from '../chapter-detail/chapter-detail.component';
import { WorkFunction } from '../../../../shared/packages/work-function-package/work-function.model';
import { HeadlineService } from '../../../../shared/packages/headline-package/headline.service';
import { ToastService } from '../../../../shared/toast.service';
import { MatDialog } from '@angular/material';
import { ConfirmPopupComponent, ConfirmPopupData } from '../../../popups/confirm-popup/confirm-popup.component';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ChapterService } from '../../../../shared/packages/chapter-package/chapter.service';

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

    constructor(private dialog: MatDialog,
                private headlineService: HeadlineService,
                private chapterService: ChapterService,
                private toast: ToastService
    ) { }

    ngOnInit() {
    }

    deleteHeadline(event: Event) {
        event.stopPropagation();
        const popupData: ConfirmPopupData = {
            title: 'Kop verwijderen',
            name: this.headline.name,
            action: 'verwijderen'
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
        this.chapterService.updateChapter(chapter, {order: event.currentIndex + 1}, {}, this.headline).subscribe((value) => {
            event.item.data = value;
        });
    }
}
