import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material';
import { animate, keyframes, style, transition, trigger } from '@angular/animations';

import { Organisation } from '../../../shared/packages/organisation-package/organisation.model';
import { TemplateService } from '../../../shared/packages/template-package/template.service';
import { Template } from '../../../shared/packages/template-package/template.model';
import { TemplateCommunicationService } from '../../../shared/service/communication/template.communication.service';
import { DefaultPopupData } from '../../popups/project-popup/project-popup.component';
import { AddTemplatePopupComponent } from '../popup/add-template-popup/add-template-popup.component';

@Component({
    selector: 'cim-templates-overview',
    templateUrl: './templates-overview.component.html',
    styleUrls: ['./templates-overview.component.css'],
    animations: [
        trigger('slideLeftAndRight', [
            transition('void => *', [
                style({ width: '0'}),
                animate('700ms cubic-bezier(0.0, 0.0, 0.2, 1)', style({ width: '100%'})),
            ]),
            transition('* => void', [
                animate('700ms cubic-bezier(0.0, 0.0, 0.2, 1)', keyframes([
                    style({ width: '0%'})
                ])),
            ])
        ]),

        trigger('slideRight', [
            transition('* => void', [
                animate('700ms cubic-bezier(0.0, 0.0, 0.2, 1)', keyframes([
                    style({ transform: 'translateX(0)', offset: 1 }),
                ])),
            ])
        ]),
    ]
})
export class TemplatesOverviewComponent implements OnInit {
    templates: Template[];
    title = 'Template beheer';
    templateToEdit: Template;
    readonly organisation: Organisation;

    constructor(
        public dialog: MatDialog,
        private templateService: TemplateService,
        private route: ActivatedRoute,
        private templateCommunication: TemplateCommunicationService
    ) {
        this.organisation = <Organisation>this.route.snapshot.data.organisation;
        this.templateService.getTemplates(this.organisation).subscribe(templates => this.templates = templates);
        this.templateCommunication.triggerAddTemplate.subscribe(onAddTemplateClicked => {
            if (onAddTemplateClicked) {
                this.showAddTemplateView();
            }
        });
    }

    ngOnInit() {
    }

    backToListView(event: Event): void {
        event.stopPropagation();
        event.preventDefault();
        this.templateToEdit = undefined;
    }

    onTemplateClick(template: Template): void {
        this.templateToEdit = template;
    }

    private showAddTemplateView(): void {
        this.templateToEdit = undefined;
        const data: DefaultPopupData = {
            title: 'Voeg een template toe',
            placeholder: 'Template naam',
            submitButton: 'Voeg toe',
            organisation: this.organisation
        };
        const dialogRef = this.dialog.open(AddTemplatePopupComponent, {
            width: '600px',
            data: data,
        });
        dialogRef.afterClosed().subscribe((newTemplate?: Template) => {
            if (newTemplate) {
                this.templates.push(newTemplate);
            }
        });
    }

}
