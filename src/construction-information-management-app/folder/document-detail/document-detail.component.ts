import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AngularEditorConfig } from '@kolkov/angular-editor';

import { Document} from '../../../shared/packages/document-package/document.model';
import { DocumentService } from '../../../shared/packages/document-package/document.service';
import { DocPostData } from '../../../shared/packages/document-package/api-document.interface';

@Component({
  selector: 'cim-document-detail',
  templateUrl: './document-detail.component.html',
  styleUrls: ['./document-detail.component.css']
})
export class DocumentDetailComponent {
    @Output() public closeEditForm: EventEmitter<boolean> = new EventEmitter();
    public documentForm: FormGroup = new FormGroup({
        name: new FormControl('')
    });
    public content = '';
    public editorConfig: AngularEditorConfig = {
        editable: true,
        spellcheck: true,
        height: '15rem',
        minHeight: '5rem',
        placeholder: 'Voer je text in...',
        translate: 'no',
    };

    private _document: Document;


    @Input()
    set document(document: Document) {
        this._document = document;
        this.updateForm();
    }

    get document(): Document {
        return this._document;
    }

    constructor(private documentService: DocumentService) { }

    public onSubmit() {
        const postData: DocPostData = {
            name: this.documentForm.controls.name.value,
            content: this.content,
        };
        this.documentService.updateDocument(this.document, postData).subscribe((document) => {
            if (document) {
                this.document = document;
            }
        });
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

}
