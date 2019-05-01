import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Organisation } from '../../../shared/packages/organisation-package/organisation.model';
import { TemplateService } from '../../../shared/packages/template-package/template.service';
import { Template } from '../../../shared/packages/template-package/template.model';
import { TemplateItemInterface } from '../../../shared/packages/template-package/interface/template-api-response.interface';

@Component({
  selector: 'cim-templates-overview',
  templateUrl: './templates-overview.component.html',
  styleUrls: ['./templates-overview.component.css']
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

    onDocumentClick(item: TemplateItemInterface): void {
    }

}
