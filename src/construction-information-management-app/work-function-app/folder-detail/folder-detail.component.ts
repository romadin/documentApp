import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { animate, keyframes, style, transition, trigger } from '@angular/animations';
import { ActivatedRoute } from '@angular/router';

import { User } from '../../../shared/packages/user-package/user.model';
import { Document } from '../../../shared/packages/document-package/document.model';
import { Folder } from '../../../shared/packages/folder-package/folder.model';
import { Subscription } from 'rxjs';
import { WorkFunction } from '../../../shared/packages/work-function-package/work-function.model';
import { ScrollingService } from '../../../shared/service/scrolling.service';

export interface ActiveItemPackage {
    component: string;
    item: Folder | Document | null;
    mainFunction?: WorkFunction;
}

@Component({
    selector: 'cim-folder-detail',
    templateUrl: './folder-detail.component.html',
    styleUrls: ['./folder-detail.component.css'],
    animations: [
        trigger('fadeIn', [
            transition('void => *', [
                style({ opacity: '0', }),
                animate('250ms 250ms', style({ opacity: '1' })),
            ]),
            transition('* => void', [
                animate('250ms', keyframes([
                    style({ opacity: '0' })
                ])),
            ])
        ]),
    ]
})
export class FolderDetailComponent implements OnInit, OnDestroy {
    @ViewChild('container') container: ElementRef;
    @Input() workFunction: WorkFunction;
    @Input() currentUser: User;
    @Output() closeView: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output() itemsAdded: EventEmitter<WorkFunction | Document> = new EventEmitter<WorkFunction | Document>();
    addFixedClass = false;
    projectId: number;
    private _activeItem: ActiveItemPackage;
    private subscription: Subscription;

    constructor(private changeDetection: ChangeDetectorRef,
                private scrollingService: ScrollingService,
                private activatedRoute: ActivatedRoute
    ) { }

    @Input()
    set activeSidePackage(activeItem: ActiveItemPackage) {
        this._activeItem = activeItem;
    }

    get activeItem(): ActiveItemPackage {
        return this._activeItem;
    }

    ngOnInit() {
        this.projectId = parseInt(this.activatedRoute.parent.parent.snapshot.params.id, 10);
        this.setPositionByScroll();
    }
    ngOnDestroy() {
        this.changeDetection.detach();
        this.subscription.unsubscribe();
    }

    onItemsAdded(item: WorkFunction| Document) {
        this.itemsAdded.emit(item);
        this._activeItem = undefined;
        this.closeView.emit(true);
    }


    onCloseView(close: boolean): void {
        this._activeItem = undefined;
        this.closeView.emit(close);
    }

    /**
     * We are getting the scroll position and by that we are setting the editDocumentContainer on an fixed position.
     */
    private setPositionByScroll(): void {
        let oldFixedClass = this.addFixedClass;
        let timeOutId: number;

        this.subscription = this.scrollingService.scrollPosition.subscribe((scrollPosition: number) => {
            if (this.container && this.container.nativeElement) {
                this.addFixedClass = scrollPosition + 5 >= this.container.nativeElement.offsetTop;
                if ( oldFixedClass !== this.addFixedClass ) {
                    if (timeOutId) {
                        clearTimeout(timeOutId);
                    }

                    timeOutId = setTimeout(() => {
                        oldFixedClass = this.addFixedClass;
                        this.changeDetection.detectChanges();
                    }, 50);
                }
            }
        });
    }
}
