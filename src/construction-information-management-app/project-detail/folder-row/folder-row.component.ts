import { Component, Input } from '@angular/core';
import { Folder } from '../../../shared/packages/folder-package/folder.model';

@Component({
  selector: 'cim-folder-row',
  templateUrl: './folder-row.component.html',
  styleUrls: ['./folder-row.component.css']
})
export class FolderRowComponent {
    private editableFolders = ['BIM Regisseur', 'BIM Manager'];
    @Input() public folder: Folder;

    constructor() { }

    public folderEditable(): boolean {
        const folder = this.editableFolders.find( (folderName) => {
            return folderName === this.folder.getName();
        });
        return folder !== undefined;
    }

}
