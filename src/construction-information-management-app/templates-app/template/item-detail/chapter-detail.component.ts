import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AngularEditorConfig } from '@kolkov/angular-editor';

import { ToastService } from '../../../../shared/toast.service';
import { Chapter } from '../../../../shared/packages/chapter-package/chapter.model';
import { WorkFunction } from '../../../../shared/packages/work-function-package/work-function.model';
import { Headline } from '../../../../shared/packages/headline-package/headline.model';
import { ChapterService } from '../../../../shared/packages/chapter-package/chapter.service';
import {
    ChapterParam,
    ChapterPostBody,
    ChapterUpdateBody
} from '../../../../shared/packages/chapter-package/interface/chapter-api-response.interface';
import { isWorkFunction } from '../../../../shared/packages/work-function-package/interface/work-function.interface';

export interface ChapterPackage {
    chapter: Chapter;
    parent: WorkFunction | Headline;
}

@Component({
  selector: 'cim-chapter-detail',
  templateUrl: './chapter-detail.component.html',
  styleUrls: ['./chapter-detail.component.css']
})
export class ChapterDetailComponent implements AfterViewInit {
    @Input() parent: WorkFunction | Headline;
    @Output() closeView: EventEmitter<boolean> = new EventEmitter<boolean>();
    chapterForm: FormGroup = new FormGroup({
        name: new FormControl('')
    });
    editorConfig: AngularEditorConfig = {
        editable: true,
        spellcheck: true,
        height: '10vh',
        minHeight: '5rem',
        placeholder: 'Voer je text in...',
        translate: 'no',
    };
    content = '';
    chapter: Chapter;
    private formHasChanged = false;

    constructor(private chapterService: ChapterService, private toast: ToastService) { }

    ngAfterViewInit() {
        this.onFormChanges();
    }

    @Input()
    set chapterPackage(chapter: Chapter) {
        if (chapter) {
            this.chapter = chapter;
            this.updateForm();
        }
    }

    onSubmit(): void {
        if (this.chapterForm.valid && this.formHasChanged) {
            const params: ChapterParam = isWorkFunction(this.parent) ? {workFunctionId: this.parent.id} : {};
            if (this.chapter) {
                const body: ChapterUpdateBody = {
                    name: this.chapterForm.controls.name.value,
                    content: this.content
                };

                this.chapterService.updateChapter(this.chapter, body, params).subscribe(chapter => {
                    this.chapter = chapter;
                    const index = this.parent.chapters.findIndex(c => c.id === chapter.id);
                    this.parent.chapters[index] = chapter;
                    this.toast.showSuccess('Hoofdstuk: ' + this.chapter.name + ' is bewerkt', 'Bewerkt');
                });
            } else {
                const body: ChapterPostBody = {
                    name: this.chapterForm.controls.name.value,
                    content: this.content
                };
                this.chapterService.createChapter(body, params).subscribe(chapter => {
                    this.chapter = chapter;
                    this.parent.chapters.push(chapter);
                    this.toast.showSuccess('Hoofdstuk: ' + this.chapter.name + 'is toegevoegd', 'Toegevoegd');
                });
            }
        }
    }

    onCloseView(e: Event): void {
        e.stopPropagation();
        e.preventDefault();
        this.closeView.emit(true);
    }

    private updateForm(): void {
        this.chapterForm.controls.name.setValue(this.chapter.name);
        this.content = this.chapter.content;
    }

    private onFormChanges() {
        let oldValue = this.chapterForm.value;
        this.chapterForm.valueChanges.subscribe(value => {
            for (const key in value) {
                if (value.hasOwnProperty(key) && oldValue.hasOwnProperty(key)) {
                    if (value[key] !== oldValue[key]) {
                        this.formHasChanged = true;
                        oldValue = value;
                        break;
                    }
                    this.formHasChanged = false;
                }
            }
        });
    }
}
