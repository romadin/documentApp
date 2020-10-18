import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Project } from '../../../shared/packages/project-package/project.model';
import { ProjectService } from '../../../shared/packages/project-package/project.service';
import { Document } from '../../../shared/packages/document-package/document.model';
import { DocumentService } from '../../../shared/packages/document-package/document.service';
import { Organisation } from '../../../shared/packages/organisation-package/organisation.model';
import { Company } from '../../../shared/packages/company-package/company.model';
import { WorkFunction } from '../../../shared/packages/work-function-package/work-function.model';
import { HeaderWithFolderCommunicationService } from '../../../shared/service/communication/HeaderWithFolder.communication.service';
import { Subscription } from 'rxjs';
import { isWorkFunction } from '../../../shared/packages/work-function-package/interface/work-function.interface';

@Component({
  selector: 'cim-item-read',
  templateUrl: './item-read.component.html',
  styleUrls: ['./item-read.component.css']
})
export class ItemReadComponent implements OnInit, OnDestroy {
    @ViewChild('fullDocument') documentPlan: any;
    @ViewChild('content') documentContent: any;
    @Input() items: Document[];
    @Input() parent: WorkFunction | Company;
    @Output() closeReadMode: EventEmitter<boolean> = new EventEmitter<boolean>();
    public project: Project;
    private organisation: Organisation;
    private subscriptions: Subscription = new Subscription();

    constructor(private router: Router,
                private activatedRoute: ActivatedRoute,
                private projectService: ProjectService,
                private documentService: DocumentService,
                private folderCommunication: HeaderWithFolderCommunicationService
                ) {
        this.organisation = this.getOrganisation();

        const projectId = parseInt(this.router.url.split('/')[2], 10);

        this.projectService.getProject(projectId, this.organisation).subscribe((project: Project) => {
            this.project = project;
        });
        this.subscriptions.add(this.folderCommunication.exportToPdf.subscribe(exportToPdf => {
            if (exportToPdf && this.project) {
                this.exportDocumentToPdf();
            }
        }));
    }

    ngOnInit() {
        this.folderCommunication.showDocumentToPdfButton.next(!this.organisation.isDemo);
    }

    ngOnDestroy() {
        this.folderCommunication.showDocumentToPdfButton.next(false);
        this.subscriptions.unsubscribe();
    }

    close(e: Event) {
        e.stopPropagation();
        e.preventDefault();
        this.closeReadMode.emit(true);
    }

    setContent(item: Document, element): void {
        element.innerHTML = item.content;
    }

    private getOrganisation(): Organisation {
        let routeParent = this.activatedRoute.snapshot;
        let organisation: Organisation;
        while (!organisation) {
            organisation = routeParent.data.organisation;
            routeParent = routeParent.parent;
        }
        return organisation;
    }

    private exportDocumentToPdf(): void {
        let url = '/pdf/';
        if (isWorkFunction(this.parent)) {
            url += this.parent.id + '/' + this.organisation.id;
        } else {
            url += this.parent.parent.id + '/' + this.organisation.id + '/' + this.parent.id;
        }

        this.subscriptions.add(this.documentService.exportPdf(url).subscribe((value) => {
            const file = new Blob([value], {type: 'application/pdf'});
            if (window.navigator.msSaveOrOpenBlob) {
                // IE10+
                window.navigator.msSaveOrOpenBlob(file, 'BIM-uitvoeringsplan');
            } else { // Others
                // create e temporary a href element so we can fake the download click.
                const a = document.createElement('a');
                const url = URL.createObjectURL(file);
                a.href = url;
                a.download = 'BIM-uitvoeringsplan';
                document.body.appendChild(a);
                a.click();
                setTimeout(function() {
                    // remove the a href element.
                    document.body.removeChild(a);
                    window.URL.revokeObjectURL(url);
                }, 0);
            }
        }));
    }

}
