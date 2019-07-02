import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material';
import { WorkFunction } from '../../../../shared/packages/work-function-package/work-function.model';
import { isWorkFunction } from '../../../../shared/packages/work-function-package/interface/work-function.interface';
import { Chapter } from '../../../../shared/packages/chapter-package/chapter.model';
import { ChapterService } from '../../../../shared/packages/chapter-package/chapter.service';
import { ChapterPackage } from '../chapter-detail/chapter-detail.component';
import { Headline } from '../../../../shared/packages/headline-package/headline.model';
import { ToastService } from '../../../../shared/toast.service';
import { ConfirmPopupComponent, ConfirmPopupData } from '../../../popups/confirm-popup/confirm-popup.component';

@Component({
  selector: 'cim-chapter',
  templateUrl: './chapter.component.html',
  styleUrls: ['./chapter.component.css']
})
export class ChapterComponent implements OnInit {
    @Input() chapter: Chapter;
    @Input() parentItem: Headline | WorkFunction;
    @Output() editChapter: EventEmitter<ChapterPackage> = new EventEmitter<ChapterPackage>();

    constructor(private dialog: MatDialog, private chapterService: ChapterService, private toast: ToastService) { }

    ngOnInit() {
    }

    onChapterClick(): void {
        this.editChapter.emit({ chapter: this.chapter, parent: this.parentItem});
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

}
