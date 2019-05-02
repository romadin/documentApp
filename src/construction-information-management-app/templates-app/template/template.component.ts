import { Component, Input, OnInit } from '@angular/core';
import { Template } from '../../../shared/packages/template-package/template.model';
import {
    TemplateItemInterface,
    TemplateParentItemInterface
} from '../../../shared/packages/template-package/interface/template-api-response.interface';
import { animate, keyframes, state, style, transition, trigger } from '@angular/animations';
import { TemplateItemEdit } from './item-detail/item-detail.component';

@Component({
    selector: 'cim-template',
    templateUrl: './template.component.html',
    styleUrls: ['./template.component.css'],
    animations: [
        trigger('toggleInView', [
            state('close', style({
                transform: 'translateX(110%)'
            })),
            state('open', style({
                width: '48%',
                transform: 'translateX(0)'
            })),
            transition('close => open', [
                animate('300ms cubic-bezier(0.0, 0.0, 0.2, 1)')
            ]),
            transition('open => close', [
                animate('300ms cubic-bezier(0.0, 0.0, 0.2, 1)', keyframes([
                    style({ transform: 'translateX(5%)', offset: 0.1}),
                    style({ transform: 'translateX(10%)', offset: 0.8}),
                    style({ transform: 'translateX(110%)', offset: 1}),
                ]))
            ]),
        ]),
        trigger('resizeWidth', [
            state('fullWidth', style({
                width: '100%'
            })),
            state('smallWidth', style({
                width: '50%'
            })),
            transition('fullWidth <=> smallWidth', [
                animate('350ms cubic-bezier(0.0, 0.0, 0.2, 1)')
            ]),
        ])
    ]
})
export class TemplateComponent implements OnInit {
    @Input() template: Template;
    templateItemToEdit: TemplateItemEdit;
    items: TemplateItemInterface[];
    constructor() { }

    ngOnInit() {
        this.setItems();
    }

    getSubDocuments(parentName: string): TemplateItemInterface[] {
        return this.template.subDocuments.find((parentItem: TemplateParentItemInterface) => parentItem.name === parentName).items;
    }

    onDocumentClick(item: TemplateItemInterface, parentName?: string): void {
        if (!this.templateItemToEdit) {
            this.templateItemToEdit = { item: item, parentName: parentName};
        } else {
            this.templateItemToEdit = undefined;
            setTimeout(() => {
                this.templateItemToEdit = { item: item, parentName: parentName };
            }, 290);
        }
    }

    onCloseItemView(): void {
        this.templateItemToEdit = undefined;
    }

    private setItems(): void {
        this.items = this.template.documents.concat(this.template.subFolders);
        this.items.sort((a: TemplateItemInterface, b: TemplateItemInterface) => a.order - b.order);
    }
}
