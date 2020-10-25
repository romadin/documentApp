import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { animate, keyframes, state, style, transition, trigger } from '@angular/animations';

import { Organisation } from '../../../shared/packages/organisation-package/organisation.model';
import { TemplateService } from '../../../shared/packages/template-package/template.service';
import { Template } from '../../../shared/packages/template-package/template.model';
import { HeaderWithFolderCommunicationService } from '../../../shared/service/communication/HeaderWithFolder.communication.service';
import { DefaultPopupData } from '../../popups/project-popup/project-popup.component';
import { AddTemplatePopupComponent } from '../popup/add-template-popup/add-template-popup.component';
import { RouterService } from '../../../shared/service/router.service';
import { getDataFromRoute } from '../../../shared/helpers/global-functions';
import { MenuAction } from '../../header/header.component';

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
    private organisation: Organisation;

    constructor(
        public dialog: MatDialog,
        private readonly templateService: TemplateService,
        private readonly route: ActivatedRoute,
        private readonly headerCommunication: HeaderWithFolderCommunicationService,
        private readonly routerService: RouterService,
    ) {

    }

    ngOnInit() {
        this.routerService.setHeaderAction(this.setHeaderAction());
        this.organisation = getDataFromRoute('organisation', this.route.snapshot) as Organisation;
        this.headerCommunication.headerTitle.next('Template beheer');
        this.templateService.getTemplates(this.organisation).subscribe(templates => this.templates = templates);
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
        const data: DefaultPopupData = {
            title: 'Wijzig template ' + template.name,
            placeholder: 'Template naam',
            submitButton: 'Wijzigen',
            organisation: this.organisation,
            item: template
        };
        this.templateDialog(data);
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

    private setHeaderAction(): MenuAction[] {
        const addTemplate: MenuAction = {
            onClick: this.templateDialog.bind(this),
            iconName: 'add',
            name: 'Template toevoegen',
            show: false,
            needsAdmin: true,
        };

        return [addTemplate];
    }

    private templateDialog(data: DefaultPopupData = {
        title: 'Voeg een template toe',
        placeholder: 'Template naam',
        submitButton: 'Voeg toe',
        organisation: this.organisation
    }): void {
        this.showAddWorkFunction = false;
        this.templateToShow = undefined;

        const dialogRef = this.dialog.open(AddTemplatePopupComponent, {
            width: '400px',
            data,
        });
        dialogRef.afterClosed().subscribe((newTemplate: Template) => {
            if (this.templateToEdit) {
                this.templateToEdit = newTemplate;
            } else {
                this.templates.push(newTemplate);
            }
        });
    }

}
