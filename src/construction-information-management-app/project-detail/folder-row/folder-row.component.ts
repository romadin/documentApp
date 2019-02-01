import { Component, Input } from '@angular/core';

import { FolderService } from '../../../shared/packages/folder-package/folder.service';
import { Folder } from '../../../shared/packages/folder-package/folder.model';
import { User } from '../../../shared/packages/user-package/user.model';
import { Router } from '@angular/router';

@Component({
  selector: 'cim-folder-row',
  templateUrl: './folder-row.component.html',
  styleUrls: ['./folder-row.component.css']
})
export class FolderRowComponent {
    @Input() public folder: Folder;
    @Input() public currentUser: User;
    @Input() public redirectUrl: string;

    private editableFolders = ['BIM Regisseur', 'BIM Manager'];
    private timerId: number;

    constructor(private folderService: FolderService, private router: Router) {
    }


    public folderEditable(): boolean {
        const folder = this.editableFolders.find( (folderName) => {
            return folderName === this.folder.getName();
        });
        return folder !== undefined;
    }

    public redirectToFolder(e: MouseEvent) {
        e.stopPropagation();
        e.preventDefault();
        this.router.navigate([this.redirectUrl]);
    }

    public toggleFolderOn(e: MouseEvent, turnOn: boolean): void {
        e.preventDefault();
        e.stopPropagation();
        this.folder.setOn(turnOn);

        if (this.timerId) {
            clearTimeout(this.timerId);
        }
        this.timerId = setTimeout(() => {
            this.folderService.postFolder({turnOn: turnOn}, this.folder.getId());
        }, 1000);
    }
}
