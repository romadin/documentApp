import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Headline } from '../../../../shared/packages/headline-package/headline.model';
import { ChapterPackage } from '../chapter-detail/chapter-detail.component';
import { WorkFunction } from '../../../../shared/packages/work-function-package/work-function.model';
import { HeadlineService } from '../../../../shared/packages/headline-package/headline.service';
import { ToastService } from '../../../../shared/toast.service';

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

    constructor(private headlineService: HeadlineService, private toast: ToastService) { }

    ngOnInit() {
    }

    deleteHeadline(event: Event) {
        event.stopPropagation();
        this.headlineService.deleteHeadline(this.headline, this.workFunction).subscribe(() => {
            this.workFunction.headlines.splice(this.workFunction.headlines.findIndex(h => h.id === this.headline.id), 1);
            this.toast.showSuccess('Functie: ' + this.headline.name + ' is verwijderd', 'Verwijderd');
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
}
