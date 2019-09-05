import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Company } from '../../../shared/packages/company-package/company.model';
import { isCompany } from '../../../shared/packages/company-package/interface/company.interface';
import { ParamDelete } from '../../../shared/packages/document-package/api-document.interface';

import { User } from '../../../shared/packages/user-package/user.model';
import { Document} from '../../../shared/packages/document-package/document.model';
import { DocumentService } from '../../../shared/packages/document-package/document.service';
import { DocumentIconService } from '../../../shared/packages/document-package/document-icon.service';
import { isWorkFunction } from '../../../shared/packages/work-function-package/interface/work-function.interface';
import { WorkFunction } from '../../../shared/packages/work-function-package/work-function.model';
export interface ToItemsOverview {
    document: Document;
    parent: Document | WorkFunction | Company;
}
@Component({
  selector: 'cim-document-row',
  templateUrl: './document-row.component.html',
  styleUrls: ['./document-row.component.css']
})
export class DocumentRowComponent implements OnInit {
    @Input() document: Document;
    @Input() currentUser: User;
    @Input() parent: Company | WorkFunction | Document;
    @Input() upperParent: WorkFunction;
    @Output() activatedDocument: EventEmitter<ToItemsOverview> = new EventEmitter<ToItemsOverview>();
    @Output() addChapter: EventEmitter<Document> = new EventEmitter<Document>();
    iconName: string;
    subDocuments: Document[];

    constructor(
        private documentIconService: DocumentIconService,
        private documentService: DocumentService,
        ) {
    }

    ngOnInit() {
        this.iconName = this.documentIconService.getIconByName(this.document.originalName);
        this.document.documents.subscribe((subDocuments) => this.subDocuments = subDocuments);
    }

    editDocument(event: Event, clickedRow = false): void {
        event.stopPropagation();
        event.preventDefault();
        const toItemsOverView: ToItemsOverview = {
            document: this.document,
            parent: this.parent,
        };
        if (clickedRow && (!this.subDocuments || this.subDocuments.length === 0)) {
            // this document is a sub document or a document without sub documents
            this.activatedDocument.emit(toItemsOverView);
        } else if (!clickedRow) {
            // clicked on the pencil so always show edit view.
            this.activatedDocument.emit(toItemsOverView);
        }
    }

    deleteDocument(e: Event): void {
        e.stopPropagation();
        e.preventDefault();

        const param: ParamDelete = isWorkFunction(this.parent) ? {workFunctionId: this.parent.id} : isCompany(this.parent) ? {companyId: this.parent.id, workFunctionId: this.parent.parent.id} : {documentId: this.parent.id};
        this.documentService.deleteDocument(this.document, param).subscribe((deleted: boolean) => {
            if ( deleted ) {
                this.removeFromParentFolder();
            }
        });
    }

    onAddChapter(e: Event| Document): void {
        if (e instanceof Event) {
            e.stopPropagation();
            e.preventDefault();
            this.addChapter.emit(this.document);
        } else {
            this.addChapter.emit(e);
        }
    }

    editSubDocument(document: Document, parent: Document) {
        this.activatedDocument.emit({ document, parent });
    }

    showDeleteButton(): boolean {
        if (this.currentUser.isAdmin()) {
            if (this.upperParent && this.upperParent.isMainFunction) {
                return true;
            } else if (this.upperParent && !this.upperParent.isMainFunction) {
                return false;
            }
            return true;
        }
        return false;
    }

    parentIsDocument(): boolean {
        return this.parent instanceof Document;
    }

    private removeFromParentFolder(): void {
        const documentsArray: Document[] = this.parent.documents.getValue();
        documentsArray.splice(documentsArray.findIndex((document => document === this.document)), 1);
        this.parent.documents.next(documentsArray);
    }

}
