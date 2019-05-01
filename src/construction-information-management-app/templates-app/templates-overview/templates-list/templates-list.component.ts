import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Template } from '../../../../shared/packages/template-package/template.model';

@Component({
  selector: 'cim-templates-list',
  templateUrl: './templates-list.component.html',
  styleUrls: ['./templates-list.component.css']
})
export class TemplatesListComponent implements OnInit {
    @Input() templates: Template[];
    @Output() showTemplate: EventEmitter<Template> = new EventEmitter();

    constructor() { }

    ngOnInit() {
    }

    onTemplateClick(template: Template): void {
        this.showTemplate.emit(template);
    }

}
