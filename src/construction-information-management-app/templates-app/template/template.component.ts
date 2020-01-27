import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { animate, keyframes, state, style, transition, trigger } from '@angular/animations';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatDialog } from '@angular/material';

import { ChapterPackage } from './chapter-detail/chapter-detail.component';
import { Template } from '../../../shared/packages/template-package/template.model';
import { ChapterService } from '../../../shared/packages/chapter-package/chapter.service';
import { isChapter } from '../../../shared/packages/chapter-package/interface/chapter.interface';
import { Chapter } from '../../../shared/packages/chapter-package/chapter.model';
import { WorkFunctionService } from '../../../shared/packages/work-function-package/work-function.service';
import { isWorkFunction } from '../../../shared/packages/work-function-package/interface/work-function.interface';
import { WorkFunction } from '../../../shared/packages/work-function-package/work-function.model';
import { map } from 'rxjs/operators';

interface ItemsContainer {
    [workFunctionId: number]: Chapter[];
}

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
    chapterParent: WorkFunction | Chapter;
    showChapterDetail: boolean;
    workFunctionToEdit: WorkFunction;
    showWorkFunctionDetail: boolean;
    itemsContainer: ItemsContainer = {};
    workFunctions: WorkFunction[];
    mainWorkFunction: WorkFunction;

    constructor(private dialog: MatDialog,
                private workFunctionService: WorkFunctionService,
                private chaptersService: ChapterService,
    ) { }

    ngOnInit() {
        this.template.workFunctions.pipe(map(workFunctions => {
            return workFunctions.map(workFunction => {
                workFunction.chapters.subscribe(chapters => this.itemsContainer[workFunction.id] = chapters);
                return workFunction;
            });
        })).subscribe((workFunctions) => {
            this.workFunctions = workFunctions;
            this.mainWorkFunction = workFunctions.find(w => w.isMainFunction);
        });
    }

    @Input()
    set addWorkFunction(add: boolean) {
        this.showWorkFunctionDetail = add;
    }

    onChapterClick(chapterPackage: ChapterPackage): void {
        if (!this.showChapterDetail) {
            this.chapterToEdit = chapterPackage.chapter;
            this.chapterParent = chapterPackage.parent;
            this.showChapterDetail = true;
        } else if (this.showChapterDetail || chapterPackage.chapter.id !== this.chapterToEdit.id) {
            this.resetVariables();
            setTimeout(() => {
                this.chapterToEdit = chapterPackage.chapter;
                this.chapterParent = chapterPackage.parent;
                this.showChapterDetail = true;
            }, 290);
        }
    }

    onCloseItemView(): void {
        this.resetVariables();
        this.cancelAddFunction.emit(true);
    }

    deleteWorkFunction(event: Event, workFunction: WorkFunction) {
        event.stopPropagation();
        if (!workFunction.isMainFunction) {
            this.workFunctionService.deleteWorkFunction(workFunction, this.template).subscribe();
        }
    }

    editWorkFunction(event: Event, workFunction: WorkFunction) {
        event.stopPropagation();
        this.resetVariables();
        setTimeout(() => {
            this.showWorkFunctionDetail = true;
            this.workFunctionToEdit = workFunction;
        }, 290);
    }
    onAddedWorkFunction(newWorkFunction: WorkFunction): void {
        this.setItemsInContainer(newWorkFunction);
    }

    addChapter(parent: WorkFunction | Chapter, e?: Event) {
        if (e) {
            e.stopPropagation();
        }
        this.resetVariables();
        setTimeout(() => {
            this.chapterParent = parent;
            this.showChapterDetail = true;
        }, 290);
    }

    dropItem(event: CdkDragDrop<any>) {
        const workFunction: WorkFunction = event.container.data;
        const item: Chapter | WorkFunction = event.item.data;
        const params = workFunction ? {workFunctionId: workFunction.id} : {};
        const body: any  = {order: event.currentIndex + 1};

        if (isWorkFunction(item)) {
            moveItemInArray(this.workFunctions, event.previousIndex, event.currentIndex);
            this.workFunctionService.updateWorkFunction(item, body).subscribe((value) => {
                event.item.data = value;
            });
        } else if (isChapter(item)) {
            moveItemInArray(this.itemsContainer[workFunction.id], event.previousIndex, event.currentIndex);
            this.chaptersService.updateChapter(item, body, params, workFunction).subscribe((value) => {
                event.item.data = value;
            });
        }
    }

    private setItemsInContainer(workFunction: WorkFunction) {
        workFunction.chapters.subscribe(chapters => {
            this.itemsContainer[workFunction.id] = chapters;
            this.itemsContainer[workFunction.id].sort((a: Chapter, b: Chapter ) => a.order - b.order);
            this.template.workFunctions[this.workFunctions.findIndex(w => w.id === workFunction.id)] = workFunction;
        });
    }

    private resetVariables(): void {
        this.chapterToEdit = undefined;
        this.showWorkFunctionDetail = false;
        this.showChapterDetail = false;
        this.workFunctionToEdit = undefined;
    }
}
