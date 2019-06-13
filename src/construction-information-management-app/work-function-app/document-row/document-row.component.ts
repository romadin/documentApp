import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { User } from '../../../shared/packages/user-package/user.model';
import { Document} from '../../../shared/packages/document-package/document.model';
import { DocumentService } from '../../../shared/packages/document-package/document.service';
import { DocumentIconService } from '../../../shared/packages/document-package/document-icon.service';
import { Folder } from '../../../shared/packages/folder-package/folder.model';

@Component({
  selector: 'cim-document-row',
  templateUrl: './document-row.component.html',
  styleUrls: ['./document-row.component.css']
})
export class DocumentRowComponent implements OnInit {
    @Input() public document: Document;
    @Input() public currentUser: User;
    @Input() public parentFolder: Folder;
    @Output() public activatedDocument: EventEmitter<Document> = new EventEmitter<Document>();
    public iconName: string;

    public highestLevelParentFolders: Folder[];
    constructor(private documentIconService: DocumentIconService, private documentService: DocumentService) {
    }

    ngOnInit() {
        this.iconName = this.documentIconService.getIconByName(this.document.originalName);
    }

    public editDocument(event: Event): void {
        event.stopPropagation();
        event.preventDefault();
        this.activatedDocument.emit(this.document);
    }

    public deleteDocument(e: Event): void {
        e.stopPropagation();
        if ( this.parentFolder ) {
            this.documentService.deleteDocument(this.document).subscribe((deleted: boolean) => {
                if ( deleted ) {
                    this.removeFromParentFolder();
                }
            });
            return;
        }
        this.documentService.deleteDocumentLink(this.document, this.parentFolder).subscribe((deleted: boolean) => {
            if ( deleted ) {
                this.removeFromParentFolder();
            }
        });
    }

    public showDeleteButton(): boolean {
        if (this.currentUser.isAdmin()) {
            if (!this.document.fromTemplate) {
                return true;
            }
            if ( this.parentFolder ) {
                return !this.document.fromTemplate;
            }
        }
        return false;
    }

    private removeFromParentFolder(): void {
        const documentsArray: Document[] = this.parentFolder.documents.getValue();
        documentsArray.splice(documentsArray.findIndex((document => document === this.document)), 1);
        this.parentFolder.documents.next(documentsArray);
    }

}
