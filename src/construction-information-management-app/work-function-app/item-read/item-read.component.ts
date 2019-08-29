import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

import { Project } from '../../../shared/packages/project-package/project.model';
import { ProjectService } from '../../../shared/packages/project-package/project.service';
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
    @ViewChild('content') documentContent: any;
    @Input() items: Document[];
    @Output() closeReadMode: EventEmitter<boolean> = new EventEmitter<boolean>();
    project: Project;
    private organisation: Organisation;
    private subscriptions: Subscription[] = [];

    constructor(private router: Router,
                private projectService: ProjectService,
                private activatedRoute: ActivatedRoute,
                private folderCommunication: HeaderWithFolderCommunicationService
                ) {
        this.organisation = this.activatedRoute.snapshot.data.organisation ? this.activatedRoute.snapshot.data.organisation : this.activatedRoute.snapshot.parent.parent.data;
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

    setContent(item: Document, element): void {
        element.innerHTML = item.content;
    }

    private exportDocumentToPdf(): void {

        const HTML_Width = this.documentContent.nativeElement.offsetWidth;
        const HTML_Height = this.documentContent.nativeElement.scrollHeight;
        const top_left_margin = 15;
        const PDF_Width = HTML_Width + (top_left_margin * 2);
        const PDF_Height = (PDF_Width * 1.5) + (top_left_margin * 2);
        const canvas_image_width = HTML_Width;
        const canvas_image_height = HTML_Height;
        const totalPDFPages = Math.ceil(HTML_Height / PDF_Height) - 1;

        html2canvas(this.documentContent.nativeElement, {allowTaint: true, height: HTML_Height}).then(function(canvas) {
            canvas.getContext('2d');

            const imgData = canvas.toDataURL("image/jpeg", 1.0);
            const pdf = new jsPDF('p', 'pt',  [PDF_Width, PDF_Height]);
            pdf.addImage(imgData, 'JPG', top_left_margin, top_left_margin, canvas_image_width, canvas_image_height);

            for (let i = 1; i <= totalPDFPages; i++) {
                pdf.addPage(PDF_Width, PDF_Height);
                pdf.addImage(imgData, 'JPG', top_left_margin, -(PDF_Height * i) + (top_left_margin * 4), canvas_image_width, canvas_image_height);
            }

            pdf.save('BIMPlan.pdf');
        });
    }

}
