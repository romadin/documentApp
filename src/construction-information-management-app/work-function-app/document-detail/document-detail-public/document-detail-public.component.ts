import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Document } from '../../../../shared/packages/document-package/document.model';

@Component({
    selector: 'cim-document-detail-public',
    templateUrl: './document-detail-public.component.html',
    styleUrls: ['./document-detail-public.component.css']
})
export class DocumentDetailPublicComponent implements OnInit {
    @Output() closeView: EventEmitter<boolean> = new EventEmitter<boolean>();
    @ViewChild('contentHolder') content: ElementRef;
    private _document: Document;

    constructor() { }

    @Input()
    set document(document: Document) {
        this._document = document;
        if (this.content) {
            this.content.nativeElement.innerHTML = this.document.content;
        }
    }

    get document(): Document {
        return this._document;
    }

    ngOnInit() {
    }

    onCloseView(e: Event) {
        e.stopPropagation();
        this.closeView.emit(true);
    }

}
