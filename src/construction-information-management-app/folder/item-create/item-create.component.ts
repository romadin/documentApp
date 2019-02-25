import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Folder } from '../../../shared/packages/folder-package/folder.model';

type ItemType = 'folder' | 'document';

@Component({
  selector: 'cim-item-create',
  templateUrl: './item-create.component.html',
  styleUrls: ['./item-create.component.css']
})
export class ItemCreateComponent implements OnInit {
    @Input() folder: Folder;
    @Output() folderChange: EventEmitter<Folder> = new EventEmitter<Folder>();
    public itemToEdit: ItemType = 'document';

    constructor() { }

    ngOnInit() {

    }

    changeEditItemForm(event, itemType: ItemType) {
        this.itemToEdit = itemType;
    }

    onFolderEdit(folder: Folder) {
        this.folderChange.emit(folder);
    }
}
