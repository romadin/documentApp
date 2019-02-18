import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';


import { FolderService } from '../../../shared/packages/folder-package/folder.service';
import { Folder } from '../../../shared/packages/folder-package/folder.model';
import { User } from '../../../shared/packages/user-package/user.model';
import { Document } from '../../../shared/packages/document-package/document.model';

@Component({
  selector: 'cim-folder-row',
  templateUrl: './folder-row.component.html',
  styleUrls: ['./folder-row.component.css']
})
export class FolderRowComponent implements OnInit {
    @Input() public folder: Folder;
    @Input() public currentUser: User;
    @Input() public redirectUrl: string;
    @Output() public sendDocumentToFolder: EventEmitter<Document> = new EventEmitter<Document>();

    public documents: Document[];

    private editableFolders = ['BIM Regisseur', 'BIM Manager'];
    private timerId: number;

    constructor(private folderService: FolderService, private router: Router) {
    }

    public ngOnInit(): void {
        this.folder.getDocuments().subscribe((documents) => {
            this.documents = documents;
        });
    }

    public folderEditable(): boolean {
        const folder = this.editableFolders.find( (folderName) => {
            return folderName === this.folder.getName();
        });
        return folder !== undefined;
    }

    public redirectToFolderOrShowDocs(e: MouseEvent) {
        e.stopPropagation();
        e.preventDefault();
        if (this.redirectUrl) {
            this.router.navigate([this.redirectUrl]);
            return;
        }


    }

    public toggleFolderOn(e: MouseEvent, turnOn: boolean): void {
        e.preventDefault();
        e.stopPropagation();
        this.folder.setOn(turnOn);

        if (this.timerId) {
            clearTimeout(this.timerId);
        }
        this.timerId = setTimeout(() => {
            this.folderService.postFolder(this.folder.id, {turnOn: turnOn});
        }, 500);
    }

    public sendOnDocumentEdit(document: Document): void {
        this.sendDocumentToFolder.emit(document);
    }
}
