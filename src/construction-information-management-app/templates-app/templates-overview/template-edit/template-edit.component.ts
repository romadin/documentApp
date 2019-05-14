import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Template } from '../../../../shared/packages/template-package/template.model';
import { FormControl, FormGroup } from '@angular/forms';
import { TemplateService } from '../../../../shared/packages/template-package/template.service';

@Component({
  selector: 'cim-template-edit',
  templateUrl: './template-edit.component.html',
  styleUrls: ['./template-edit.component.css']
})
export class TemplateEditComponent implements OnInit {
    @Input() template: Template;
    @Output() closeDetail: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output() templateEdited: EventEmitter<Template> = new EventEmitter<Template>();
    templateForm: FormGroup = new FormGroup({
        name: new FormControl('')
    });

    constructor(private templateService: TemplateService) { }

    ngOnInit() {
    }

    onSubmit() {
        if (!this.templateForm.invalid) {
            const body = { name: this.templateForm.controls.name.value };
            this.templateService.updateTemplate(this.template, body).subscribe((template: Template) => {
                this.template = template;
                this.templateEdited.emit(template);
            });
        }
    }

    onCancel(e: MouseEvent) {
        e.stopPropagation();
        e.preventDefault();
        this.closeDetail.emit(true);
    }

}
