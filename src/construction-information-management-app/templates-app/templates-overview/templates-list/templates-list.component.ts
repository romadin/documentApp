import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Template } from '../../../../shared/packages/template-package/template.model';
import { TemplateService } from '../../../../shared/packages/template-package/template.service';
import { ToastService } from '../../../../shared/toast.service';

@Component({
  selector: 'cim-templates-list',
  templateUrl: './templates-list.component.html',
  styleUrls: ['./templates-list.component.css']
})
export class TemplatesListComponent implements OnInit {
    @Input() templates: Template[];
    @Output() showTemplate: EventEmitter<Template> = new EventEmitter();
    @Output() onTemplateEdit: EventEmitter<Template> = new EventEmitter();

    constructor(
        private templateService: TemplateService,
        private toast: ToastService
    ) { }

    ngOnInit() {
    }

    onTemplateClick(template: Template): void {
        this.showTemplate.emit(template);
    }

    deleteTemplate(e: Event, templateToDelete: Template): void {
        e.preventDefault();
        e.stopPropagation();
        this.templateService.deleteTemplate(templateToDelete).subscribe(succes => {
            this.toast.showSuccess('Template: ' + templateToDelete.name + ' is verwijderd', 'Verwijderd');
            this.templates.splice(
                this.templates.findIndex(template => template.id === templateToDelete.id),
                1
            );
        });
    }

    editWorkFunction(e: Event, template: Template): void {
        e.preventDefault();
        e.stopPropagation();
        this.onTemplateEdit.emit(template);
    }

}
