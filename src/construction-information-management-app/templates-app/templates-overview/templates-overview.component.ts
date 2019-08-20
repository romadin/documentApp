import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material';
import { animate, keyframes, state, style, transition, trigger } from '@angular/animations';

import { Organisation } from '../../../shared/packages/organisation-package/organisation.model';
import { TemplateService } from '../../../shared/packages/template-package/template.service';
import { Template } from '../../../shared/packages/template-package/template.model';
import { HeaderWithFolderCommunicationService } from '../../../shared/service/communication/HeaderWithFolder.communication.service';
import { TemplateCommunicationService } from '../../../shared/service/communication/template.communication.service';
import { DefaultPopupData } from '../../popups/project-popup/project-popup.component';
import { AddTemplatePopupComponent } from '../popup/add-template-popup/add-template-popup.component';

@Component({
    selector: 'cim-templates-overview',
    templateUrl: './templates-overview.component.html',
    styleUrls: ['./templates-overview.component.css'],
    animations: [
        trigger('slideLeftAndRight', [
            state('fullOpen', style({
                width: '100%'
            })),
            state('halfOpen', style({
                width: '50%'
            })),
            transition('fullOpen <=> halfOpen', [
                animate('400ms cubic-bezier(0.0, 0.0, 0.2, 1)')
            ]),
            transition('void => *', [
                style({ width: '0'}),
                animate('700ms cubic-bezier(0.0, 0.0, 0.2, 1)', style({ width: '100%'})),
            ]),
            transition('* => void', [
                animate('700ms cubic-bezier(0.0, 0.0, 0.2, 1)', keyframes([
                    style({ width: '0%', overflow: 'hidden'})
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
        trigger('slideRightOutView', [
            transition('* => void', [
                animate('200ms cubic-bezier(0.0, 0.0, 0.2, 1)', keyframes([
                    style({ transform: 'translateX(0)', offset: 1 }),
                ])),
            ])
        ]),
    ]
})
export class TemplatesOverviewComponent implements OnInit {
    templates: Template[];
    title = 'Templates';
    templateToShow: Template;
    templateToEdit: Template;
    showAddWorkFunction: boolean;
    addNewFunction = false;
    readonly organisation: Organisation;

    constructor(
        public dialog: MatDialog,
        private templateService: TemplateService,
        private route: ActivatedRoute,
        private templateCommunication: TemplateCommunicationService,
        private headerCommunication: HeaderWithFolderCommunicationService,
    ) {
        this.organisation = <Organisation>this.route.snapshot.data.organisation;
        this.headerCommunication.headerTitle.next('Template beheer');
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
        this.templateToShow = undefined;
        this.showAddWorkFunction = false;
        this.title = 'Templates';
    }

    onTemplateClick(template: Template): void {
        this.templateToEdit = undefined;
        setTimeout(() => {
            this.templateToShow = template;
            this.title = this.templateToShow.name;
            this.showAddWorkFunction = true;
        }, 200);
    }

    editTemplate(template: Template): void {
        this.templateToEdit = template;
    }

    OnCloseTemplateEdit(close: boolean): void {
        if (close) {
            this.templateToEdit = undefined;
        }
    }

    onCancelAddFunction(cancel: boolean): void {
        if (cancel) {
            this.addNewFunction = false;
        }
    }

    OnTemplateEdited(template: Template): void {
        this.templates[this.templates.findIndex(t => t.id === template.id)] = template;
    }

    addFunction(): void {
        this.addNewFunction = true;
    }

    private showAddTemplateView(): void {
        this.showAddWorkFunction = false;
        this.templateToShow = undefined;
        const data: DefaultPopupData = {
            title: 'Voeg een template toe',
            placeholder: 'Template naam',
            submitButton: 'Voeg toe',
            organisation: this.organisation
        };
        const dialogRef = this.dialog.open(AddTemplatePopupComponent, {
            width: '400px',
            data: data,
        });
        dialogRef.afterClosed().subscribe((newTemplate?: Template) => {
            if (newTemplate) {
                this.templates.push(newTemplate);
            }
        });
    }

}
