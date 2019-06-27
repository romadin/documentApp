import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Company } from '../../../shared/packages/company-package/company.model';
import { isCompany } from '../../../shared/packages/company-package/interface/company.interface';
import { ParamDelete } from '../../../shared/packages/document-package/api-document.interface';

import { User } from '../../../shared/packages/user-package/user.model';
import { Document} from '../../../shared/packages/document-package/document.model';
import { DocumentService } from '../../../shared/packages/document-package/document.service';
import { DocumentIconService } from '../../../shared/packages/document-package/document-icon.service';
import { Folder } from '../../../shared/packages/folder-package/folder.model';
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
    @Input() parent: Folder | Company | WorkFunction;
    @Output() activatedDocument: EventEmitter<Document> = new EventEmitter<Document>();
    public iconName: string;

    public highestLevelParentFolders: Folder[];
    constructor(
        private documentIconService: DocumentIconService,
        private documentService: DocumentService,
        ) {
    }

    ngOnInit() {
        this.iconName = this.documentIconService.getIconByName(this.document.originalName);
    }

    editDocument(event: Event): void {
        event.stopPropagation();
        event.preventDefault();
        this.activatedDocument.emit(this.document);
    }

    deleteDocument(e: Event): void {
        e.stopPropagation();
        e.preventDefault();
        const param: ParamDelete = {};
        isWorkFunction(this.parent) ? param.workFunctionId = this.parent.id : isCompany(this.parent) ? param.companyId = this.parent.id : param.folderId = this.parent.id;
        this.documentService.deleteDocument(this.document, param).subscribe((deleted: boolean) => {
            if ( deleted ) {
                this.removeFromParentFolder();
            }
        });
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

    private removeFromParentFolder(): void {
        const documentsArray: Document[] = this.parent.documents.getValue();
        documentsArray.splice(documentsArray.findIndex((document => document === this.document)), 1);
        this.parent.documents.next(documentsArray);
    }

}
