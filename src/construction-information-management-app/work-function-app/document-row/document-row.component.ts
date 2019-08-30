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

@Component({
  selector: 'cim-document-row',
  templateUrl: './document-row.component.html',
  styleUrls: ['./document-row.component.css']
})
export class DocumentRowComponent implements OnInit {
    @Input() document: Document;
    @Input() currentUser: User;
    @Input() parent: Company | WorkFunction | Document;
    @Output() activatedDocument: EventEmitter<Document> = new EventEmitter<Document>();
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
        if (clickedRow && (!this.subDocuments || this.subDocuments.length === 0)) {
            this.activatedDocument.emit(this.document);
        } else if (!clickedRow) {
            this.activatedDocument.emit(this.document);
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

    editSubDocument(subDocument) {
        this.activatedDocument.emit(subDocument);
    }

    showDeleteButton(): boolean {
        if (this.currentUser.isAdmin()) {
            if (!this.document.fromTemplate) {
                return true;
            }
            return (isWorkFunction(this.parent) && !this.parent.isMainFunction) || !isWorkFunction(this.parent);
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
