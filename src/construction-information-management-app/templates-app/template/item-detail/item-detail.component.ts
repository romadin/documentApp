import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AngularEditorConfig } from '@kolkov/angular-editor';

import { TemplateItemInterface } from '../../../../shared/packages/template-package/interface/template-api-response.interface';
import { Template } from '../../../../shared/packages/template-package/template.model';
import { TemplateService } from '../../../../shared/packages/template-package/template.service';
import { ToastService } from '../../../../shared/toast.service';

export type TemplateItemType = 'subDocument' | 'document';

export interface TemplateItemEdit {
    item: TemplateItemInterface;
    parentName?: string;
}

@Component({
  selector: 'cim-template-item-detail',
  templateUrl: './item-detail.component.html',
  styleUrls: ['./item-detail.component.css']
})
export class ItemDetailComponent implements OnInit {
    @Input() template: Template;
    @Output() closeView: EventEmitter<boolean> = new EventEmitter<boolean>();
    templateItemForm: FormGroup = new FormGroup({
        name: new FormControl('')
    });
    editorConfig: AngularEditorConfig = {
        editable: true,
        spellcheck: true,
        height: '10vh',
        minHeight: '5rem',
        placeholder: 'Voer je text in...',
        translate: 'no',
    };
    content = '';
    private parentName: string;
    private _item: TemplateItemInterface;

    constructor(private templateService: TemplateService, private toast: ToastService) { }
    ngOnInit() { }

    @Input()
    set itemEdit(item: TemplateItemEdit) {
        if (item) {
            this.parentName = item.parentName;
            this._item = item.item;
            this.updateForm();
        }
    }
    get item(): TemplateItemInterface {
        return this._item;
    }

    onSubmit(): void {
        if (this.templateItemForm.valid) {
            this.item.name = this.templateItemForm.get('name').value;
            this.item.content = this.content;
            const body = this.parentName ? this.patchBodyWithParent() : this.createPatchBody();
            console.log(body);

            this.templateService.updateTemplate(this.template, body).subscribe(template => {
                this.toast.showSuccess('Template item: ' + this.item.name + ' is bewerkt', 'Bewerkt');
            });
        }
    }

    onCloseView(): void {
        this.closeView.emit(true);
    }

    private updateForm(): void {
        this.templateItemForm.controls.name.setValue(this.item.name);
        // this.template.organisationId === 0 ? this.templateItemForm.controls.name.disable() : this.templateItemForm.controls.name.enable();
        this.templateItemForm.controls.name.disable();
        this.content = this.item.content;
    }

    private createPatchBody() {
        return {
            documents: JSON.stringify({
                name: this.item.name,
                content: this.item.content,
                order: this.item.order
            })
        };
    }

    private patchBodyWithParent() {
        return {
            subDocuments: JSON.stringify({
                name: this.parentName,
                items: {
                    name: this.item.name,
                    content: this.item.content,
                    order: this.item.order
                }
            })
        };
    }
}
