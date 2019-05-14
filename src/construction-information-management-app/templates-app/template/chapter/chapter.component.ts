import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Chapter } from '../../../../shared/packages/chapter-package/chapter.model';
import { ChapterPackage } from '../item-detail/chapter-detail.component';
import { Headline } from '../../../../shared/packages/headline-package/headline.model';
import { WorkFunction } from '../../../../shared/packages/work-function-package/work-function.model';
import { ChapterService } from '../../../../shared/packages/chapter-package/chapter.service';
import { ToastService } from '../../../../shared/toast.service';
import { isWorkFunction } from '../../../../shared/packages/work-function-package/interface/work-function.interface';

@Component({
  selector: 'cim-chapter',
  templateUrl: './chapter.component.html',
  styleUrls: ['./chapter.component.css']
})
export class ChapterComponent implements OnInit {
    @Input() chapter: Chapter;
    @Input() parentItem: Headline | WorkFunction;
    @Output() editChapter: EventEmitter<ChapterPackage> = new EventEmitter<ChapterPackage>();

    constructor(private chapterService: ChapterService, private toast: ToastService) { }

    ngOnInit() {
    }

    onChapterClick(): void {
        this.editChapter.emit({ chapter: this.chapter, parent: this.parentItem});
    }

    deleteChapter(e: Event): void {
        e.stopPropagation();
        e.preventDefault();
        const params = isWorkFunction(this.parentItem) ? {workFunctionId: this.parentItem.id} : {};
        this.chapterService.deleteChapter(this.chapter, params).subscribe(message => {
            this.parentItem.chapters.splice(this.parentItem.chapters.findIndex(c => c.id === this.chapter.id), 1);
            this.toast.showSuccess('Hoofdstuk: ' + this.chapter.name + ' is verwijderd', 'Verwijderd');
        });
    }

}
