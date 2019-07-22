import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { WorkFunctionService } from '../../../shared/packages/work-function-package/work-function.service';
import { HeaderWithFolderCommunicationService } from '../../../shared/service/communication/HeaderWithFolder.communication.service';

@Component({
  selector: 'cim-corporate-identity',
  templateUrl: './corporate-identity.component.html',
  styleUrls: ['./corporate-identity.component.css']
})
export class CorporateIdentityComponent implements OnInit {

    constructor(private headerCommunication: HeaderWithFolderCommunicationService,
                private workFunctionService: WorkFunctionService
    ) { }

    ngOnInit() {

        this.headerCommunication.headerTitle.next('Huisstijl');
    }

}
