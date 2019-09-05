import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material';
import { isChapter } from '../../../../shared/packages/chapter-package/interface/chapter.interface';
import { Headline } from '../../../../shared/packages/headline-package/headline.model';
import { isHeadline } from '../../../../shared/packages/headline-package/interface/headline-api-response.interface';
import { WorkFunction } from '../../../../shared/packages/work-function-package/work-function.model';
import { isWorkFunction } from '../../../../shared/packages/work-function-package/interface/work-function.interface';
import { Chapter } from '../../../../shared/packages/chapter-package/chapter.model';
import { ChapterService } from '../../../../shared/packages/chapter-package/chapter.service';
import { ChapterPackage } from '../chapter-detail/chapter-detail.component';
import { ToastService } from '../../../../shared/toast.service';
import { ConfirmPopupComponent, ConfirmPopupData } from '../../../popups/confirm-popup/confirm-popup.component';

@Component({
  selector: 'cim-chapter',
  templateUrl: './chapter.component.html',
  styleUrls: ['./chapter.component.css']
})
export class ChapterComponent implements OnInit {
    @Input() chapter: Chapter;
    @Input() parentItem: Chapter | WorkFunction;
    @Output() editChapter: EventEmitter<ChapterPackage> = new EventEmitter<ChapterPackage>();
    subChapters: Chapter[];

    constructor(private dialog: MatDialog, private chapterService: ChapterService, private toast: ToastService) { }

    ngOnInit() {
        this.chapter.chapters.subscribe((c) => this.subChapters = c);
    }

    onAddChapter(e: Event) {
        e.stopPropagation();

        console.log('show add chapter view');
        // this.addChapter.emit(this.headline);
    }

    onChapterClick(value, clickedRow = false): void {
        const toTemplateOverview = { chapter: this.chapter, parent: this.parentItem};

        if (clickedRow && (!this.subChapters || this.subChapters.length === 0)) {
            // this chapter is a sub chapter or a chapter without sub documents
            this.editChapter.emit(toTemplateOverview);
        } else if (!clickedRow) {
            // clicked on the pencil so always show edit view.
            this.editChapter.emit(toTemplateOverview);
        }
    }

    editSubChapter(chapter: Chapter, parent: Chapter) {
        this.editChapter.emit({ chapter, parent });
    }

    deleteChapter(e: Event): void {
        e.stopPropagation();
        e.preventDefault();
        const popupData: ConfirmPopupData = {
            title: 'Hoofdstuk verwijderen',
            name: this.chapter.name,
            message: `Weet u zeker dat u <strong>${this.chapter.name}</strong> wilt verwijderen`,
            firstButton: 'ja',
            secondButton: 'nee'
        };
        this.dialog.open(ConfirmPopupComponent, {width: '400px', data: popupData}).afterClosed().subscribe((action) => {
            if (action) {
                const params = isWorkFunction(this.parentItem) ? {workFunctionId: this.parentItem.id} : {};
                this.chapterService.deleteChapter(this.chapter, params).subscribe(message => {
                    const chapters: Chapter[] = this.parentItem.chapters.getValue();
                    chapters.splice(chapters.findIndex(c => c.id === this.chapter.id), 1);
                    this.parentItem.chapters.next(chapters);
                    this.toast.showSuccess('Hoofdstuk: ' + this.chapter.name + ' is verwijderd', 'Verwijderd');
                });
            }
        });
    }

    drop(event: CdkDragDrop<any>) {
        const parentChapter: Chapter = event.container.data;
        const chapter: Chapter = event.item.data;
        const body: any  = {order: event.currentIndex + 1};

        moveItemInArray(this.subChapters, event.previousIndex, event.currentIndex);
        this.chapterService.updateChapter(chapter, body, {}, parentChapter).subscribe((value) => {
            event.item.data = value;
        });
    }
}
