import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ConfirmPopupComponent, ConfirmPopupData } from '../../../popups/confirm-popup/confirm-popup.component';
import { ToastService } from '../../../../shared/toast.service';
import { ChapterPackage } from '../chapter-detail/chapter-detail.component';
import { WorkFunction } from '../../../../shared/packages/work-function-package/work-function.model';
import { isWorkFunction } from '../../../../shared/packages/work-function-package/interface/work-function.interface';
import { Chapter } from '../../../../shared/packages/chapter-package/chapter.model';
import { ChapterService } from '../../../../shared/packages/chapter-package/chapter.service';
import { of, Subscription } from 'rxjs';

@Component({
  selector: 'cim-chapter',
  templateUrl: './chapter.component.html',
  styleUrls: ['./chapter.component.css']
})
export class ChapterComponent implements OnInit {
    @Input() chapter: Chapter;
    @Input() parentItem: Chapter | WorkFunction;
    @Output() editChapter: EventEmitter<ChapterPackage> = new EventEmitter<ChapterPackage>();
    @Output() addChapter: EventEmitter<Chapter> = new EventEmitter<Chapter>();
    subChapters: Chapter[];
    subscription: Subscription;

    constructor(private dialog: MatDialog, private chapterService: ChapterService, private toast: ToastService) { }

    ngOnInit() {
        this.subscription = this.chapter.chapters.subscribe((c) => this.subChapters = c);
    }

    onAddChapter(e: Event) {
        e.stopPropagation();
        this.addChapter.emit(this.chapter);
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
                let params;
                if (isWorkFunction(this.parentItem)) {
                    params = {workFunctionId: this.parentItem.id};
                    this.chapter.chapters = of();
                } else {
                    params = {chapterId: this.parentItem.id};
                }
                this.subscription.unsubscribe();

                this.chapterService.deleteChapter(this.chapter, params).subscribe(message => {
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

    parentIsWorkFunction(): boolean {
        return isWorkFunction(this.chapter.parent)
    }
}
