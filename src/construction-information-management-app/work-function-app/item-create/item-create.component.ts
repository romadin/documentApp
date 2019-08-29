import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { User } from '../../../shared/packages/user-package/user.model';
import { WorkFunction } from '../../../shared/packages/work-function-package/work-function.model';

type ItemType = 'title' | 'content';

@Component({
  selector: 'cim-item-create',
  templateUrl: './item-create.component.html',
  styleUrls: ['./item-create.component.css']
})
export class ItemCreateComponent implements OnInit {
    @Input() workFunction: WorkFunction;
    @Input() currentUser: User;
    // @Output() folderChange: EventEmitter<Folder> = new EventEmitter<Folder>();
    @Output() public closeView: EventEmitter<boolean> = new EventEmitter();

    public itemToEdit: ItemType = 'title';

    constructor() { }

    ngOnInit() {}

    changeEditItemForm(event, itemType: ItemType) {
        this.itemToEdit = itemType;
    }

    // onFolderEdit(folder: Folder) {
    //     this.folderChange.emit(folder);
    // }

    public onCloseView(): void {
        this.closeView.emit(true);
    }
}
