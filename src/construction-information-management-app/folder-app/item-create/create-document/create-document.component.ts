import { Component, Input, OnInit } from '@angular/core';
import { Folder } from '../../../../shared/packages/folder-package/folder.model';
import { FolderCommunicationService } from '../../../../shared/service/communication/Folder.communication.service';

@Component({
  selector: 'cim-create-document',
  templateUrl: './create-document.component.html',
  styleUrls: ['./create-document.component.css']
})
export class CreateDocumentComponent implements OnInit {
    @Input() parentFolder: Folder;

    constructor(private folderCommunication: FolderCommunicationService) { }

    ngOnInit() {

    }

    onCloseCreateDocument(closeForm: boolean): void {
        if (closeForm) {
            this.folderCommunication.onItemCloseListener.next(true);
        }
    }

}
