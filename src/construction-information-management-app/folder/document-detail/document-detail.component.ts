import {
    ChangeDetectorRef,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Output,
    ViewChild
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AngularEditorConfig } from '@kolkov/angular-editor';

import { Document} from '../../../shared/packages/document-package/document.model';
import { DocumentService } from '../../../shared/packages/document-package/document.service';
import { DocPostData } from '../../../shared/packages/document-package/api-document.interface';
import { ScrollingService } from '../../../shared/service/scrolling.service';
import { Folder } from '../../../shared/packages/folder-package/folder.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'cim-document-detail',
  templateUrl: './document-detail.component.html',
  styleUrls: ['./document-detail.component.css']
})
export class DocumentDetailComponent implements OnInit, OnDestroy {
    @ViewChild('editDocumentContainer') container: ElementRef;
    @Output() public closeEditForm: EventEmitter<boolean> = new EventEmitter();
    @Input() parentFolder: Folder;
    public documentForm: FormGroup = new FormGroup({
        name: new FormControl('')
    });
    public editorConfig: AngularEditorConfig = {
        editable: true,
        spellcheck: true,
        height: '15rem',
        minHeight: '5rem',
        placeholder: 'Voer je text in...',
        translate: 'no',
        uploadUrl: '/assets/images',
    };
    public content = '';
    public addFixedClass = false;

    private _document: Document;
    private subscription: Subscription;

    @Input()
    set document(document: Document) {
        this._document = document;
        this.updateForm();
    }

    get document(): Document {
        return this._document;
    }

    constructor(private documentService: DocumentService,
                private scrollingService: ScrollingService,
                private changeDetection: ChangeDetectorRef) { }

    ngOnInit() {
        this.setPositionByScroll();
    }

    ngOnDestroy() {
        this.changeDetection.detach();
        this.subscription.unsubscribe();
    }

    public onSubmit() {
        const postData: DocPostData = {
            name: this.documentForm.controls.name.value,
            content: this.content,
        };
        if (this.document) {
            this.documentService.updateDocument(this.document, postData).subscribe((document) => {
                if (document) {
                    this.document = document;
                }
            });
        } else {
            postData.folderId = this.parentFolder.id;
            this.documentService.postDocument(postData).subscribe((document) => {
                if (document) {
                    this.parentFolder.addDocument(document);
                    this.document = document;
                    this.closeEditForm.emit(true);
                }
            });
        }
    }

    public cancel(event: MouseEvent): void {
        event.stopPropagation();
        event.preventDefault();
        this.closeEditForm.emit(true);
    }

    private updateForm(): void {
        this.documentForm.controls.name.setValue(this.document.getName());
        this.content = this.document.content !== null ? this.document.content : '';
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
                    }, 10);
                }
            }
        });
    }

}
