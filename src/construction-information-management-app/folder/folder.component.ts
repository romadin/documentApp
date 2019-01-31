import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { FolderService } from '../../shared/packages/folder-package/folder.service';
import { Folder } from '../../shared/packages/folder-package/folder.model';
import { DocumentService } from '../../shared/packages/document-package/document.service';
import { Document } from '../../shared/packages/document-package/document.model';
import { UserService } from '../../shared/packages/user-package/user.service';
import { User } from '../../shared/packages/user-package/user.model';

@Component({
  selector: 'cim-folder',
  templateUrl: './folder.component.html',
  styleUrls: ['./folder.component.css']
})
export class FolderComponent implements OnInit {
    public documents: Document[];
    public subFolders: Folder[];
    public currentUser: User;
    public subFolderRedirectUrl: string;
    public documentToEdit: Document;

    constructor(private folderService: FolderService,
                private documentService: DocumentService,
                private userService: UserService,
                private activatedRoute: ActivatedRoute) { }

    ngOnInit() {
        const folderId: number = parseInt(this.activatedRoute.snapshot.paramMap.get('id'), 10);
        this.subFolderRedirectUrl = '/subfolder/';

        this.userService.getCurrentUser().subscribe((user: User) => {
            this.currentUser = user;
        });
        this.folderService.getFolder(folderId).subscribe((folder: Folder) => {
            this.subFolders = folder.getSubFolders();
        });
        this.documentService.getDocuments(folderId).subscribe((documents: Document[]) => {
            this.documents = documents;
        });
    }

    public onActivateDocument(document: Document) {
        this.documentToEdit = document;
    }

    public onDocumentEditClose(closeForm: boolean) {
        if (closeForm) {
            this.documentToEdit = null;
        }
    }
}
