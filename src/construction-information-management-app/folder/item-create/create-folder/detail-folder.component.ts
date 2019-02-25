import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { Folder } from '../../../../shared/packages/folder-package/folder.model';
import { FolderService } from '../../../../shared/packages/folder-package/folder.service';
import { NewFolderPostData } from '../../../../shared/packages/folder-package/api-folder.interface';
import { FolderCommunicationService } from '../../../../shared/packages/communication/Folder.communication.service';
import { Document } from '../../../../shared/packages/document-package/document.model';
import { DocumentService } from '../../../../shared/packages/document-package/document.service';

@Component({
  selector: 'cim-detail-folder',
  templateUrl: './detail-folder.component.html',
  styleUrls: ['./detail-folder.component.css']
})
export class DetailFolderComponent implements OnInit {
    @Input() parentFolder: Folder;
    @Output() editedFolder: EventEmitter<Folder> = new EventEmitter<Folder>();
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
        this.getHighestParentFolders();
    }

    get folder(): Folder {
        return this._folder;
    }

    private highestLevelParentFolders: Folder[];

    constructor(
        private folderService: FolderService,
        private folderCommunicationService: FolderCommunicationService,
        private documentService: DocumentService) { }

    ngOnInit() {
        if (this.folder) {
            this.folderForm.controls.name.setValue(this.folder.getName());
        }

    }

    onSubmit() {
        const postData: NewFolderPostData = {
            name: this.folderForm.controls.name.value,
            parentFolderId: this.parentFolder.id,
        };
        this.folderService.createFolder(postData).subscribe((newFolder: Folder) => {
            this.parentFolder.addSubFolder(newFolder);
            this.editedFolder.emit(this.parentFolder);
        });
    }

    showDeleteButton(document: Document): boolean {
        if ( document.fromTemplate ) {
            if ( this.folder.isMainFolder ) {
                return !document.fromTemplate;
            } else {
                return !this.highestLevelParentFolders.find((parentFolder: Folder) => parentFolder.isMainFolder);
            }
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
        this.documentService.deleteDocumentLink(documentToDelete, this.folder).subscribe((deleted: boolean) => {
            if ( deleted ) {
                const documentsArray: Document[] = this.folder.getDocuments().getValue();
                documentsArray.splice(documentsArray.findIndex((document => document === documentToDelete)), 1);
                this.folder.getDocuments().next(documentsArray);
            }
        });
    }

    private getDocuments(): void {
        this.folder.getDocuments().subscribe((documents) => {
            this.documents = documents;
        });
    }

    private getHighestParentFolders(): void {
        this.folder.parentFolders.subscribe((parentFolders: Folder[]) => {
            this.highestLevelParentFolders = parentFolders;
        });
    }

}
