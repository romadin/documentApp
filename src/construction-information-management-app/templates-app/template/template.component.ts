import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Template } from '../../../shared/packages/template-package/template.model';
import {
    TemplateItemInterface,
    TemplateParentItemInterface
} from '../../../shared/packages/template-package/interface/template-api-response.interface';

@Component({
  selector: 'cim-template',
  templateUrl: './template.component.html',
  styleUrls: ['./template.component.css']
})
export class TemplateComponent implements OnInit {
    @Input() template: Template;
    @Output() showDocument: EventEmitter<TemplateItemInterface> = new EventEmitter<TemplateItemInterface>();
    templateItemToEdit: TemplateItemInterface;
    items: TemplateItemInterface[];
    constructor() { }

    ngOnInit() {
        this.setItems();
    }

    getSubDocuments(parentName: string): TemplateItemInterface[] {
        return this.template.subDocuments.find((parentItem: TemplateParentItemInterface) => parentItem.name === parentName).items;
    }

    onDocumentClick(item: TemplateItemInterface): void {
        this.showDocument.emit(item);
        this.templateItemToEdit = item;
    }

    onCloseItemView(): void {
        this.templateItemToEdit = undefined;
    }

    private setItems(): void {
        this.items = this.template.documents.concat(this.template.subFolders);
        this.items.sort((a: TemplateItemInterface, b: TemplateItemInterface) => a.order - b.order);
    }

}
