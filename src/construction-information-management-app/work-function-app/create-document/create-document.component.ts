import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Document } from '../../../shared/packages/document-package/document.model';

import { WorkFunction } from '../../../shared/packages/work-function-package/work-function.model';
import { User } from '../../../shared/packages/user-package/user.model';

@Component({
  selector: 'cim-create-document',
  templateUrl: './create-document.component.html',
  styleUrls: ['./create-document.component.css']
})
export class CreateDocumentComponent implements OnInit {
    @Input() parent: WorkFunction | Document;
    @Input() currentUser: User;
    @Output() closeView: EventEmitter<boolean> = new EventEmitter();

    constructor() { }

    ngOnInit() { }

    onCloseCreateDocument(): void {
        this.closeView.emit(true);
    }

}
