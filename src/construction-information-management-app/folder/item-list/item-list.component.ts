import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { filter, map } from 'rxjs/operators';

import { Folder } from '../../../shared/packages/folder-package/folder.model';
import { FolderService } from '../../../shared/packages/folder-package/folder.service';
import { DocumentService } from '../../../shared/packages/document-package/document.service';
import { Document } from '../../../shared/packages/document-package/document.model';

@Component({
  selector: 'cim-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.css']
})
export class ItemListComponent implements OnInit {
    @Output() cancelAddItems: EventEmitter<boolean> = new EventEmitter();
    @Output() saveItemsDone: EventEmitter<Folder> = new EventEmitter();
    @Input() mainFolder: Folder;
    public items = [];
    public itemsSelected;

    private _currentFolder: Folder;

    @Input()
    set currentFolder(currentFolder: Folder) {
        this._currentFolder = currentFolder;
    }

    get currentFolder(): Folder {
        return this._currentFolder;
    }

    constructor(private folderService: FolderService, private documentService: DocumentService) { }

    ngOnInit() {
        this.mainFolder.getSubFolders().forEach((folder) => {
            this.items.push(folder);
        });

        this.getDocumentAvailable().then((documents: Document[]) => {
            documents.forEach(document => this.items.push(document));
        });
    }

    public isFolder(item: any) {
        return item instanceof Folder;
    }

    public cancelList(e: MouseEvent) {
        e.stopPropagation();
        e.preventDefault();
        this.cancelAddItems.emit(true);
    }

    public saveItems(e: MouseEvent) {
        e.stopPropagation();
        e.preventDefault();
        this.folderService.postFolderLinkItems(this.currentFolder.getId(), this.itemsSelected).subscribe((folder) => {
            console.log(folder);
            this.saveItemsDone.emit(folder);
        });
    }

    private getDocumentAvailable(): Promise<Document[]> {
        return new Promise((resolve) => {
            this.mainFolder.getDocuments().subscribe((documents) => {
                this.currentFolder.getDocuments().subscribe((currentDocs) => {
                    if (currentDocs.length === 0 ) {
                        return resolve(documents);
                    }
                    currentDocs.forEach((currentDoc) => {
                        documents.forEach((document, key) => {
                            if ( document.id === currentDoc.id ) {
                                documents.splice(key, 1);
                            }
                        });
                    });
                    return resolve(documents);
                });
            });
        });
    }

}
