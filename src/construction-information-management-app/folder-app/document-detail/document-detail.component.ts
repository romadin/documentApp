import {
    AfterViewInit,
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
import { Subscription } from 'rxjs';

import { Document} from '../../../shared/packages/document-package/document.model';
import { DocumentService } from '../../../shared/packages/document-package/document.service';
import { DocPostData } from '../../../shared/packages/document-package/api-document.interface';
import { Folder } from '../../../shared/packages/folder-package/folder.model';
import { ScrollingService } from '../../../shared/service/scrolling.service';
import { environment } from '../../../environments/environment';
import { ToastService } from '../../../shared/toast.service';
import { User } from '../../../shared/packages/user-package/user.model';

@Component({
    selector: 'cim-document-detail',
    templateUrl: './document-detail.component.html',
    styleUrls: ['./document-detail.component.css']
})
export class DocumentDetailComponent implements OnInit, OnDestroy, AfterViewInit {
    @Input() parentFolder: Folder;
    @Input() currentUser: User;
    @Output() public closeEditForm: EventEmitter<boolean> = new EventEmitter();
    @ViewChild('editDocumentContainer') container: ElementRef;
    public documentForm: FormGroup = new FormGroup({
        name: new FormControl('')
    });
    public editorConfig: AngularEditorConfig = {
        editable: true,
        spellcheck: true,
        height: '20vh',
        minHeight: '5rem',
        placeholder: 'Voer je text in...',
        translate: 'no',
    };
    public content = '';
    public addFixedClass = false;

    private subscription: Subscription;
    private formHasChanged = false;
    private startValue = '';
    private _document: Document;

    @Input()
    set document(document: Document) {
        this._document = document;
        this.editorConfig.uploadUrl = environment.API_URL + '/documents/' + document.id + '/image?token=' + sessionStorage.getItem('token');
        this.updateForm();
    }

    get document(): Document {
        return this._document;
    }

    constructor(private documentService: DocumentService,
                private scrollingService: ScrollingService,
                private changeDetection: ChangeDetectorRef,
                private toast: ToastService) { }

    ngOnInit() {
        this.setPositionByScroll();
    }
    ngAfterViewInit() {
        this.onFormChanges();
    }
    ngOnDestroy() {
        this.changeDetection.detach();
        this.subscription.unsubscribe();
    }

    public onSubmit() {
        if (this.documentForm.valid && this.formHasChanged) {
            const postData: DocPostData = {
                name: this.documentForm.controls.name.value,
                content: this.content,
            };
            if ( this.document ) {
                this.documentService.updateDocument(this.document, postData).subscribe((document) => {
                    if ( document ) {
                        this.document = document;
                        this.toast.showSuccess('Hoofdstuk: ' + this.document.getName() + ' is bewerkt', 'Bewerkt');
                    }
                });
            } else {
                postData.folderId = this.parentFolder.id;
                this.documentService.postDocument(postData).subscribe((document) => {
                    if ( document ) {
                        this.parentFolder.addDocument(document);
                        this.document = document;
                        this.closeEditForm.emit(true);
                        this.toast.showSuccess('Hoofdstuk: ' + document.getName() + ' is toegevoegd', 'Toegevoegd');
                    }
                });
            }
        }
    }

    public onCloseView(event?: MouseEvent): void {
        if (event) {
            event.stopPropagation();
            event.preventDefault();
        }
        this.closeEditForm.emit(true);
    }
    dataChanged(): void {
        this.formHasChanged = this.content !== this.startValue;
    }

    private updateForm(): void {
        this.documentForm.controls.name.setValue(this.document.getName());
        this.startValue = this.content = this.document.content !== null ? this.document.content : '';
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

    private onFormChanges() {
        let oldValue = this.documentForm.value;
        this.documentForm.valueChanges.subscribe(value => {
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
