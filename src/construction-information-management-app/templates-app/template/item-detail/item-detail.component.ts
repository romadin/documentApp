import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TemplateItemInterface } from '../../../../shared/packages/template-package/interface/template-api-response.interface';
import { FormControl, FormGroup } from '@angular/forms';
import { AngularEditorConfig } from '@kolkov/angular-editor';

@Component({
  selector: 'cim-template-item-detail',
  templateUrl: './item-detail.component.html',
  styleUrls: ['./item-detail.component.css']
})
export class ItemDetailComponent implements OnInit {
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
    private _item: TemplateItemInterface;

    constructor() { }
    ngOnInit() { }

    @Input()
    set item(item: TemplateItemInterface) {
        this._item = item;
        if (item) {
            this.updateForm();
        }
    }
    get item(): TemplateItemInterface {
        return this._item;
    }

    onSubmit(): void {
        if (this.templateItemForm.valid) {

        }
    }

    onCloseView(): void {
        this.closeView.emit(true);
    }

    private updateForm(): void {
        this.templateItemForm.controls.name.setValue(this.item.name);
        this.content = this.item.content;
    }

}
