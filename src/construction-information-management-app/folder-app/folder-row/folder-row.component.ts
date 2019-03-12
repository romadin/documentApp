import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';


import { FolderService } from '../../../shared/packages/folder-package/folder.service';
import { Folder } from '../../../shared/packages/folder-package/folder.model';
import { User } from '../../../shared/packages/user-package/user.model';
import { Document } from '../../../shared/packages/document-package/document.model';
import { Project } from '../../../shared/packages/project-package/project.model';

@Component({
  selector: 'cim-folder-row',
  templateUrl: './folder-row.component.html',
  styleUrls: ['./folder-row.component.css']
})
export class FolderRowComponent implements OnInit {
    @Input() parent: Folder | Project;
    @Input() public folder: Folder;
    @Input() public currentUser: User;
    @Input() public redirectUrl: string;
    @Output() public sendDocumentToFolder: EventEmitter<Document> = new EventEmitter<Document>();
    @Output() public sendFolderToFolderComponent: EventEmitter<Folder> = new EventEmitter<Folder>();
    @Output() public sendDeletedFolderToFolderComponent: EventEmitter<Folder> = new EventEmitter<Folder>();

    public documents: Document[];

    private editableFolders = ['BIM Regisseur', 'BIM Manager'];
    private timerId: number;

    constructor(private folderService: FolderService, private router: Router, private activatedRoute: ActivatedRoute) {
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
            this.router.navigate([this.redirectUrl], {relativeTo: this.activatedRoute});
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

    public editFolder(e: MouseEvent) {
        e.stopPropagation();
        e.preventDefault();
        this.sendFolderToFolderComponent.emit(this.folder);
    }

    deleteFolder(e: Event): void {
        e.preventDefault();
        e.stopPropagation();
        if (this.parent instanceof Folder) {
            const params = this.parent && this.parent.isMainFolder ? {} : { parentFolderId: this.parent.id };
            this.folderService.deleteFolder(this.folder, params).subscribe((deleted) => {
                if (deleted) {
                    (<Folder>this.parent).getSubFolders().splice((<Folder>this.parent).getSubFolders()
                        .findIndex((subFolder => subFolder === this.folder)), 1);
                    this.sendDeletedFolderToFolderComponent.emit(this.folder);
                }
            });
        }
    }

    showDeleteButton(): boolean {
        if (this.currentUser.isAdmin()) {
            if (!this.folder.fromTemplate) {
                return true;
            }
            if (this.parent instanceof Folder) {
                return !this.parent.isMainFolder;
            }
            return false;
        }
        return false;
    }

    public sendOnDocumentEdit(document: Document): void {
        this.sendDocumentToFolder.emit(document);
    }
}
