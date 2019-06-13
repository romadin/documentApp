import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';


import { FolderService } from '../../../shared/packages/folder-package/folder.service';
import { Folder } from '../../../shared/packages/folder-package/folder.model';
import { User } from '../../../shared/packages/user-package/user.model';
import { Document } from '../../../shared/packages/document-package/document.model';
import { WorkFunction } from '../../../shared/packages/work-function-package/work-function.model';

@Component({
  selector: 'cim-folder-row',
  templateUrl: './folder-row.component.html',
  styleUrls: ['./folder-row.component.css']
})
export class FolderRowComponent implements OnInit {
    @Input() parent: WorkFunction;
    @Input() folder: Folder;
    @Input() currentUser: User;
    @Input() redirectUrl: string;
    @Output() sendDocumentToFolder: EventEmitter<Document> = new EventEmitter<Document>();
    @Output() sendFolderToFolderComponent: EventEmitter<Folder> = new EventEmitter<Folder>();
    @Output() sendDeletedFolderToFolderComponent: EventEmitter<Folder> = new EventEmitter<Folder>();

    public documents: Document[];


    constructor(private folderService: FolderService, private router: Router, private activatedRoute: ActivatedRoute) {
    }

    public ngOnInit(): void {
        this.folder.documents.subscribe((documents) => {
            this.documents = documents;
        });
    }

    public redirectToFolderOrShowDocs(e: MouseEvent) {
        e.stopPropagation();
        e.preventDefault();
        if (this.redirectUrl) {
            this.router.navigate([this.redirectUrl], {relativeTo: this.activatedRoute});
            return;
        }
    }


    public editFolder(e: MouseEvent) {
        e.stopPropagation();
        e.preventDefault();
        this.sendFolderToFolderComponent.emit(this.folder);
    }

    deleteFolder(e: Event): void {
        e.preventDefault();
        e.stopPropagation();
            const params = this.parent && this.parent.isMainFunction ? {} : { parentFolderId: this.parent.id };
            this.folderService.deleteFolder(this.folder, params).subscribe((deleted) => {
                if (deleted) {
                    this.parent.folders.getValue().splice((this.parent).folders.getValue()
                        .findIndex((subFolder => subFolder === this.folder)), 1);
                    this.sendDeletedFolderToFolderComponent.emit(this.folder);
                }
            });
    }

    showDeleteButton(): boolean {
        if (this.currentUser.isAdmin()) {
            if (!this.folder.fromTemplate) {
                return true;
            }
            if (this.parent instanceof Folder) {
                return !this.parent.isMainFunction;
            }
            return false;
        }
        return false;
    }

    public sendOnDocumentEdit(document: Document): void {
        this.sendDocumentToFolder.emit(document);
    }
}
