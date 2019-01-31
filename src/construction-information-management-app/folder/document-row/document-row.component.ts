import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { Document} from '../../../shared/packages/document-package/document.model';
import { User } from '../../../shared/packages/user-package/user.model';
import { DocumentIconService } from '../../../shared/packages/document-package/document-icon.service';

@Component({
  selector: 'cim-document-row',
  templateUrl: './document-row.component.html',
  styleUrls: ['./document-row.component.css']
})
export class DocumentRowComponent implements OnInit {
    @Input() public document: Document;
    @Input() public currentUser: User;
    @Output() public activatedDocument: EventEmitter<Document> = new EventEmitter<Document>();
    public iconName: string;

    constructor(private documentIconService: DocumentIconService) {
    }

    ngOnInit() {
        this.iconName = this.documentIconService.getIconByName(this.document.originalName);
    }

    public editDocument(): void {
        this.activatedDocument.emit(this.document);
    }

}
