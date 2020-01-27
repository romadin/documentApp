import { AfterViewInit, Component, EventEmitter, Input, Output } from '@angular/core';
import { WorkFunction } from '../../../../../shared/packages/work-function-package/work-function.model';
import { Chapter } from '../../../../../shared/packages/chapter-package/chapter.model';
import { FormControl, FormGroup } from '@angular/forms';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { ChapterService } from '../../../../../shared/packages/chapter-package/chapter.service';
import { ToastService } from '../../../../../shared/toast.service';
import {
    ChapterParam,
    ChapterPostBody
} from '../../../../../shared/packages/chapter-package/interface/chapter-api-response.interface';
import { isWorkFunction } from '../../../../../shared/packages/work-function-package/interface/work-function.interface';

@Component({
  selector: 'cim-chapter-edit',
  templateUrl: './chapter-edit.component.html',
  styleUrls: ['./chapter-edit.component.css']
})
export class ChapterEditComponent implements AfterViewInit {
    @Input() parent: WorkFunction | Chapter;
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
    private _chapter: Chapter;
    private formHasChanged = false;
    private startValue = '';

    constructor(private chapterService: ChapterService, private toast: ToastService) { }

    ngAfterViewInit() {
        this.onFormChanges();
    }

    @Input()
    set chapter(chapter: Chapter) {
        if (chapter) {
            this._chapter = chapter;
            this.updateForm();
        }
    }
    get chapter(): Chapter {
        return this._chapter;
    }

    onSubmit(e: Event): void {
        if (this.chapterForm.valid && this.formHasChanged) {
            const params: ChapterParam = isWorkFunction(this.parent) ? {workFunctionId: this.parent.id} : {};
            const body: ChapterPostBody = {
                name: this.chapterForm.controls.name.value,
                content: this.content
            };
            if (this.chapter) {
                this.chapterService.updateChapter(this.chapter, body, params, this.parent).subscribe(chapter => {
                    this.toast.showSuccess('Hoofdstuk: ' + this.chapter.name + ' is bewerkt', 'Bewerkt');
                });
            } else {
                body.parentChapterId = isWorkFunction(this.parent) ? null : this.parent.id;
                this.chapterService.createChapter(body, params, this.parent).subscribe(chapter => {
                    this.toast.showSuccess('Hoofdstuk: ' + chapter.name + 'is toegevoegd', 'Toegevoegd');
                });
            }
        }
    }

    dataChanged(): void {
        this.formHasChanged = this.content !== this.startValue;
    }

    onCloseView(e: Event): void {
        e.stopPropagation();
        e.preventDefault();
        this.closeView.emit(true);
    }

    private updateForm(): void {
        this.chapterForm.controls.name.setValue(this.chapter.name);
        this.startValue = this.content = this.chapter.content;
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
