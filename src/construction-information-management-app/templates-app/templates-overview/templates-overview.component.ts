import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Organisation } from '../../../shared/packages/organisation-package/organisation.model';
import { TemplateService } from '../../../shared/packages/template-package/template.service';
import { Template } from '../../../shared/packages/template-package/template.model';
import { animate, keyframes, state, style, transition, trigger } from '@angular/animations';

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

    constructor(private templateService: TemplateService, private route: ActivatedRoute) {
        const organisation: Organisation = <Organisation>this.route.snapshot.data.organisation;
        this.templateService.getTemplates(organisation).subscribe(templates => this.templates = templates);
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

}
