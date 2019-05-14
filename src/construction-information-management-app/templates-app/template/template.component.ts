import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Template } from '../../../shared/packages/template-package/template.model';
import {
    TemplateItemInterface,
    TemplateParentItemInterface
} from '../../../shared/packages/template-package/interface/template-api-response.interface';
import { animate, keyframes, state, style, transition, trigger } from '@angular/animations';
import { ChapterPackage } from './item-detail/chapter-detail.component';
import { WorkFunction } from '../../../shared/packages/work-function-package/work-function.model';
import { WorkFunctionService } from '../../../shared/packages/work-function-package/work-function.service';
import { ToastService } from '../../../shared/toast.service';
import { Headline } from '../../../shared/packages/headline-package/headline.model';
import { Chapter } from '../../../shared/packages/chapter-package/chapter.model';
import { Document } from '../../../shared/packages/document-package/document.model';
import { Folder } from '../../../shared/packages/folder-package/folder.model';
import { isChapter } from '../../../shared/packages/chapter-package/interface/chapter.interface';

@Component({
    selector: 'cim-template',
    templateUrl: './template.component.html',
    styleUrls: ['./template.component.css'],
    animations: [
        trigger('toggleInView', [
            state('close', style({
                transform: 'translateX(110%)'
            })),
            state('open', style({
                width: '48%',
                transform: 'translateX(0)'
            })),
            transition('close => open', [
                animate('300ms cubic-bezier(0.0, 0.0, 0.2, 1)')
            ]),
            transition('open => close', [
                animate('300ms cubic-bezier(0.0, 0.0, 0.2, 1)', keyframes([
                    style({ transform: 'translateX(5%)', offset: 0.1}),
                    style({ transform: 'translateX(10%)', offset: 0.8}),
                    style({ transform: 'translateX(110%)', offset: 1}),
                ]))
            ]),
            transition('void => *', [
                style({ opacity: '0'}),
                animate('100ms cubic-bezier(0.0, 0.0, 0.2, 1)', style({ opacity: '1'})),
            ]),
            transition('* => void', [
                animate('100ms cubic-bezier(0.0, 0.0, 0.2, 1)', keyframes([
                    style({ opacity: '0'})
                ])),
            ])
        ]),
        trigger('resizeWidth', [
            state('fullWidth', style({
                width: '100%'
            })),
            state('smallWidth', style({
                width: '50%'
            })),
            transition('fullWidth <=> smallWidth', [
                animate('350ms cubic-bezier(0.0, 0.0, 0.2, 1)')
            ]),
        ])
    ]
})
export class TemplateComponent implements OnInit {
    @Input() template: Template;
    @Output() cancelAddFunction: EventEmitter<boolean> = new EventEmitter<boolean>();
    chapterToEdit: Chapter;
    chapterParent: WorkFunction | Headline;
    showChapterDetail: boolean;
    workFunctionToEdit: WorkFunction;
    showWorkFunctionDetail: boolean;
    items: TemplateItemInterface[];

    constructor(private workFunctionService: WorkFunctionService,
                private toast: ToastService) { }

    ngOnInit() {
    }

    @Input()
    set addWorkFunction(add: boolean) {
        this.showWorkFunctionDetail = add;
    }

    onChapterClick(chapterPackage: ChapterPackage): void {
        if (!this.chapterToEdit) {
            this.chapterToEdit = chapterPackage.chapter;
            this.chapterParent = chapterPackage.parent;
            this.showChapterDetail = true;
        } else if (chapterPackage.chapter.id !== this.chapterToEdit.id) {
            this.chapterToEdit = undefined;
            this.showWorkFunctionDetail = false;
            this.showChapterDetail = false;
            setTimeout(() => {
                this.chapterToEdit = chapterPackage.chapter;
                this.chapterParent = chapterPackage.parent;
                this.showChapterDetail = true;
            }, 290);
        }
    }

    onCloseItemView(): void {
        this.chapterToEdit = undefined;
        this.workFunctionToEdit = undefined;
        this.showWorkFunctionDetail = false;
        this.showChapterDetail = false;
        this.cancelAddFunction.emit(true);
    }

    deleteWorkFunction(event: Event, workFunction: WorkFunction) {
        event.stopPropagation();
        if (!workFunction.isMainFunction) {
            this.workFunctionService.deleteWorkFunction(workFunction).subscribe(() => {
                this.template.workFunctions.splice(this.template.workFunctions.findIndex(w => w.id === workFunction.id), 1);
                this.toast.showSuccess('Functie: ' + workFunction.name + ' is verwijderd', 'Verwijderd');
            });
        }
    }

    editWorkFunction(event: Event, workFunction: WorkFunction) {
        event.stopPropagation();
        this.chapterToEdit = undefined;
        setTimeout(() => {
            this.showWorkFunctionDetail = true;
            this.workFunctionToEdit = workFunction;
        }, 290);
    }

    addChapter(e: Event, workFunction: WorkFunction) {
        e.stopPropagation();
        this.chapterParent = workFunction;
        this.showChapterDetail = true;
    }

    addHeadline(e: Event, workFunction: WorkFunction) {
        e.stopPropagation();
    }

    checkIfChapter(item: Chapter | Headline): boolean {
        return isChapter(item);
    }

    getItemsFromWorkFunction(workFunction: WorkFunction): Array <Headline | Chapter> {
        let items: (Chapter | Headline)[] = [];

        if (workFunction.chapters && workFunction.headlines) {
            items = workFunction.chapters;
            items = items.concat(workFunction.headlines);
            items.sort((a: Chapter | Headline, b: Chapter | Headline ) => a.order - b.order);
        }

        return items;
    }
}
