import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

import { Project } from '../../../shared/packages/project-package/project.model';
import { ProjectService } from '../../../shared/packages/project-package/project.service';
import { Folder } from '../../../shared/packages/folder-package/folder.model';
import { Document } from '../../../shared/packages/document-package/document.model';
import { Organisation } from '../../../shared/packages/organisation-package/organisation.model';
import { HeaderWithFolderCommunicationService } from '../../../shared/service/communication/HeaderWithFolder.communication.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'cim-item-read',
  templateUrl: './item-read.component.html',
  styleUrls: ['./item-read.component.css']
})
export class ItemReadComponent implements OnInit, OnDestroy {
    @ViewChild('fullDocument') documentPlan: any;
    @Input() items: (Folder | Document)[];
    @Output() closeReadMode: EventEmitter<boolean> = new EventEmitter<boolean>();
    project: Project;
    private organisation: Organisation;
    private subscriptions: Subscription[] = [];

    constructor(private router: Router,
                private projectService: ProjectService,
                private activatedRoute: ActivatedRoute,
                private folderCommunication: HeaderWithFolderCommunicationService
                ) {
        this.organisation = <Organisation>this.activatedRoute.snapshot.data.organisation;
        const projectId = parseInt(this.router.url.split('/')[2], 10);

        this.projectService.getProject(projectId, this.organisation).subscribe((project: Project) => {
            this.project = project;
        });
        this.subscriptions.push(this.folderCommunication.exportToPdf.subscribe(exportToPdf => {
            if (exportToPdf && this.project) {
                this.exportDocumentToPdf();
            }
        }));
    }

    ngOnInit() {
        this.folderCommunication.showDocumentToPdfButton.next(true);
    }

    ngOnDestroy() {
        this.folderCommunication.showDocumentToPdfButton.next(false);
        this.subscriptions.map(s => s.unsubscribe());
    }

    close(e: Event) {
        e.stopPropagation();
        e.preventDefault();
        this.closeReadMode.emit(true);
    }

    checkItemIsFolder(item): boolean {
        return item instanceof Folder;
    }

    setContent(item: Document, element): void {
        element.innerHTML = item.content;
    }

    private exportDocumentToPdf(): void {
        // html2canvas(this.documentPlan.nativeElement).then( canvas => {
        //     const imgWidth = 225;
        //     const pageHeight = 295;
        //     const imgHeight = canvas.height * imgWidth / canvas.width;
        //     const heightLeft = imgHeight;
        //
        //     const contentDatatUrl = canvas.toDataURL('image/png');
        //     const pdf = new jsPDF();
        //     pdf.addImage(contentDatatUrl, 'PNG', 0, 2, imgWidth, imgHeight);
        //     pdf.save('BIMPlan.pdf');
        // });
        const doc = new jsPDF();
        const elementHandler = {
            '#ignorePDF': function (element, renderer) {
                return true;
            }
        };
        const source = this.documentPlan.nativeElement;
        doc.fromHTML(
            source,
            15,
            15,
            {
                'width': 180, 'elementHandlers': elementHandler
            }, function(bla) { doc.save('BIMPlan.pdf'); });
    }

}
