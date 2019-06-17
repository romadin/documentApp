import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { FolderCommunicationService } from '../../../../shared/service/communication/Folder.communication.service';
import { ToastService } from '../../../../shared/toast.service';
import { WorkFunction } from '../../../../shared/packages/work-function-package/work-function.model';
import { User } from '../../../../shared/packages/user-package/user.model';
import { DocumentService } from '../../../../shared/packages/document-package/document.service';
import { Document } from '../../../../shared/packages/document-package/document.model';
import { NewFolderPostData } from '../../../../shared/packages/folder-package/api-folder.interface';
import { FolderService } from '../../../../shared/packages/folder-package/folder.service';
import { Folder } from '../../../../shared/packages/folder-package/folder.model';

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
    }

    get folder(): Folder {
        return this._folder;
    }

    constructor(
        private folderService: FolderService,
        private folderCommunicationService: FolderCommunicationService,
        private documentService: DocumentService,
        private toast: ToastService) { }

    ngOnInit() {
        if (this.folder) {
            this.folderForm.controls.name.setValue(this.folder.name);
        }

    }

    onSubmit() {
        const currentFolders = this.parent.folders.getValue();
        const postData: NewFolderPostData = {
            name: this.folderForm.controls.name.value,
        };

        if (this.folder) {
            this.folderService.postFolder(this.folder.id, postData, this.parent).subscribe(folder => {
                this.folder = folder;
                const index = currentFolders.findIndex(f => f.id === folder.id);
                currentFolders[index] = folder;
                this.parent.folders.next(currentFolders);
                console.log(this.folder);
            });
        } else {
            this.folderService.createFolder(postData, this.parent).subscribe((newFolder: Folder) => {
                currentFolders.push(newFolder);
                this.parent.folders.next(currentFolders);
                this.editedFolder.emit(this.parent);
            });
        }
    }

    showDeleteButton(document: Document): boolean {
        if ( document.fromTemplate ) {
            return !this.parent.isMainFunction;
        }
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
        this.documentService.deleteDocument(documentToDelete).subscribe((deleted: boolean) => {
            if ( deleted ) {
                const documentsArray: Document[] = this.folder.documents.getValue();
                documentsArray.splice(documentsArray.findIndex((document => document === documentToDelete)), 1);
                this.folder.documents.next(documentsArray);
                this.toast.showSuccess('Document: ' + documentToDelete.name + ' is verwijderd', 'Verwijderd');
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
