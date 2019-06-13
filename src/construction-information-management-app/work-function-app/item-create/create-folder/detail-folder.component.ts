import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { Folder } from '../../../../shared/packages/folder-package/folder.model';
import { FolderService } from '../../../../shared/packages/folder-package/folder.service';
import { NewFolderPostData } from '../../../../shared/packages/folder-package/api-folder.interface';
import { WorkFunction } from '../../../../shared/packages/work-function-package/work-function.model';
import { FolderCommunicationService } from '../../../../shared/service/communication/Folder.communication.service';
import { Document } from '../../../../shared/packages/document-package/document.model';
import { DocumentService } from '../../../../shared/packages/document-package/document.service';
import { User } from '../../../../shared/packages/user-package/user.model';

@Component({
  selector: 'cim-detail-folder',
  templateUrl: './detail-folder.component.html',
  styleUrls: ['./detail-folder.component.css']
})
export class DetailFolderComponent implements OnInit {
    @Input() parent: WorkFunction;
    @Input() currentUser: User;
    @Output() editedFolder: EventEmitter<WorkFunction> = new EventEmitter<WorkFunction>();
    public folderForm: FormGroup = new FormGroup({
        name: new FormControl('')
    });
    public documents: Document[];
    public showAddDocument = false;

    private _folder: Folder;

    @Input()
    set folder(folder: Folder) {
        this._folder = folder;
        this.getDocuments();
        // this.getHighestParentFolders();
    }

    get folder(): Folder {
        return this._folder;
    }

    constructor(
        private folderService: FolderService,
        private folderCommunicationService: FolderCommunicationService,
        private documentService: DocumentService) { }

    ngOnInit() {
        if (this.folder) {
            this.folderForm.controls.name.setValue(this.folder.name);
        }

    }

    onSubmit() {
        const postData: NewFolderPostData = {
            name: this.folderForm.controls.name.value,
            parentFolderId: this.parent.id,
        };
        this.folderService.createFolder(postData).subscribe((newFolder: Folder) => {
            const currentFolders = this.parent.folders.getValue();
            currentFolders.push(newFolder);
            this.parent.folders.next(currentFolders);
            this.editedFolder.emit(this.parent);
        });
    }

    showDeleteButton(document: Document): boolean {
        return true;
    }

    onCancel(e: MouseEvent) {
        e.stopPropagation();
        e.preventDefault();
        this.folderCommunicationService.onItemCloseListener.next(true);
    }
    onCloseAddDocument(onClose: boolean) {
        this.showAddDocument = !onClose;
    }

    addDocument(e: Event): void {
        e.preventDefault();
        this.showAddDocument = true;
    }

    deleteDocument(e: Event, documentToDelete: Document): void {
        e.stopPropagation();
        e.preventDefault();
        this.documentService.deleteDocumentLink(documentToDelete, this.folder).subscribe((deleted: boolean) => {
            if ( deleted ) {
                const documentsArray: Document[] = this.folder.documents.getValue();
                documentsArray.splice(documentsArray.findIndex((document => document === documentToDelete)), 1);
                this.folder.documents.next(documentsArray);
            }
        });
    }

    public setContent(document: Document, element: HTMLElement): void {
        element.innerHTML = document.content ? document.content : 'Er is nog geen content bij dit hoofdstuk';
    }

    private getDocuments(): void {
        this.folder.documents.subscribe((documents) => {
            this.documents = documents;
        });
    }

}
