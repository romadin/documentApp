import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Template } from '../../../shared/packages/template-package/template.model';
import { animate, keyframes, state, style, transition, trigger } from '@angular/animations';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatDialog } from '@angular/material';

import { ChapterPackage } from './chapter-detail/chapter-detail.component';
import { WorkFunction } from '../../../shared/packages/work-function-package/work-function.model';
import { WorkFunctionService } from '../../../shared/packages/work-function-package/work-function.service';
import { Headline } from '../../../shared/packages/headline-package/headline.model';
import { isHeadline } from '../../../shared/packages/headline-package/interface/headline-api-response.interface';
import { HeadlineService } from '../../../shared/packages/headline-package/headline.service';
import { Chapter } from '../../../shared/packages/chapter-package/chapter.model';
import { isChapter } from '../../../shared/packages/chapter-package/interface/chapter.interface';
import { ChapterService } from '../../../shared/packages/chapter-package/chapter.service';
import { ConfirmPopupComponent, ConfirmPopupData } from '../../popups/confirm-popup/confirm-popup.component';
import { HeadlinePackage } from './headline/headline.component';
import { ToastService } from '../../../shared/toast.service';
import { isWorkFunction } from '../../../shared/packages/work-function-package/interface/work-function.interface';

interface ItemsContainer {
    [workFunctionId: number]: (Chapter | Headline)[];
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
    chapterParent: WorkFunction | Headline;
    showChapterDetail: boolean;
    workFunctionToEdit: WorkFunction;
    showWorkFunctionDetail: boolean;
    showHeadlineDetail: boolean;
    headlineParent: WorkFunction;
    headlineToEdit: Headline;
    itemsContainer: ItemsContainer = {};

    constructor(private dialog: MatDialog,
                private workFunctionService: WorkFunctionService,
                private chaptersService: ChapterService,
                private headlinesService: HeadlineService,
                private toast: ToastService
    ) { }

    ngOnInit() {
        this.template.workFunctions.forEach((workFunction) => this.setItemsInContainer(workFunction));
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
            const popupData: ConfirmPopupData = {
                title: 'Functie verwijderen',
                name: workFunction.name,
                action: 'verwijderen'
            };
            this.dialog.open(ConfirmPopupComponent, {width: '400px', data: popupData}).afterClosed().subscribe((action) => {
                if (action) {
                    this.workFunctionService.deleteWorkFunction(workFunction).subscribe(() => {
                        this.template.workFunctions.splice(this.template.workFunctions.findIndex(w => w.id === workFunction.id), 1);
                        this.toast.showSuccess('Functie: ' + workFunction.name + ' is verwijderd', 'Verwijderd');
                    });
                }
            });
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

    onEditHeadlineClick(headlinePackage: HeadlinePackage) {
        this.resetVariables();
        setTimeout(() => {
            this.showHeadlineDetail = true;
            this.headlineToEdit = headlinePackage.headline;
            this.headlineParent = headlinePackage.parent;
        }, 290);
    }

    addChapter(parent: WorkFunction | Headline, e?: Event) {
        if (e) {
            e.stopPropagation();
        }

        if (this.showChapterDetail) {
            this.resetVariables();
            setTimeout(() => {
                this.chapterParent = parent;
                this.showChapterDetail = true;
            }, 290);
        } else {
            this.chapterParent = parent;
            this.showChapterDetail = true;
        }
    }

    addHeadline(e: Event, workFunction: WorkFunction) {
        e.stopPropagation();
        this.resetVariables();
        setTimeout(() => {
            this.showHeadlineDetail = true;
            this.headlineParent = workFunction;
        }, 290);
    }

    dropItem(event: CdkDragDrop<any>) {
        const workFunction: WorkFunction = event.container.data;
        const item: Chapter | Headline | WorkFunction = event.item.data;
        const params = workFunction ? {workFunctionId: workFunction.id} : {};
        const body: any  = {order: event.currentIndex + 1};

        if (isWorkFunction(item)) {
            moveItemInArray(this.template.workFunctions, event.previousIndex, event.currentIndex);
            this.workFunctionService.updateWorkFunction(item, body).subscribe((value) => {
                event.item.data = value;
            });
        } else if (isChapter(item)) {
            moveItemInArray(this.itemsContainer[workFunction.id], event.previousIndex, event.currentIndex);
            this.chaptersService.updateChapter(item, body, params).subscribe((value) => {
                event.item.data = value;
            });
        } else if (isHeadline(item)) {
            moveItemInArray(this.itemsContainer[workFunction.id], event.previousIndex, event.currentIndex);
            this.headlinesService.updateHeadline(body, item, workFunction).subscribe((value) => {
                event.item.data = value;
            });
        }
    }

    checkIfChapter(item: Chapter | Headline): boolean {
        return isChapter(item);
    }

    private setItemsInContainer(workFunction: WorkFunction) {
        if (workFunction.chapters && workFunction.headlines) {
            this.itemsContainer[workFunction.id] = workFunction.chapters;
            this.itemsContainer[workFunction.id] = this.itemsContainer[workFunction.id].concat(workFunction.headlines);
            this.itemsContainer[workFunction.id].sort((a: Chapter | Headline, b: Chapter | Headline ) => a.order - b.order);
        }
    }

    private resetVariables(): void {
        this.chapterToEdit = undefined;
        this.showWorkFunctionDetail = false;
        this.showChapterDetail = false;
        this.workFunctionToEdit = undefined;
        this.showHeadlineDetail = false;
        this.headlineParent = undefined;
        this.headlineToEdit = undefined;
    }
}
