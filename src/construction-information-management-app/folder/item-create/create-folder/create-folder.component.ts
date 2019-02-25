import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Folder } from '../../../../shared/packages/folder-package/folder.model';
import { FolderService } from '../../../../shared/packages/folder-package/folder.service';
import { FormControl, FormGroup } from '@angular/forms';
import { NewFolderPostData } from '../../../../shared/packages/folder-package/api-folder.interface';
import { FolderCommunicationService } from '../../../../shared/packages/communication/Folder.communication.service';

@Component({
  selector: 'cim-create-folder',
  templateUrl: './create-folder.component.html',
  styleUrls: ['./create-folder.component.css']
})
export class CreateFolderComponent implements OnInit {
    @Input() parentFolder: Folder;
    @Output() editedFolder: EventEmitter<Folder> = new EventEmitter<Folder>();
    public folderForm: FormGroup = new FormGroup({
        name: new FormControl('')
    });

    constructor(private folderService: FolderService, private folderCommunicationService: FolderCommunicationService) { }

    ngOnInit() {

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

    onCancel(e: MouseEvent) {
        e.stopPropagation();
        e.preventDefault();
        this.folderCommunicationService.onItemCloseListener.next(true);
    }

}
