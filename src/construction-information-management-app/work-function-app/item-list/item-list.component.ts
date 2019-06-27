import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { combineLatest } from 'rxjs';
import { CompanyApiUpdataData } from '../../../shared/packages/company-package/interface/company-api-response.interface';
import { Company } from '../../../shared/packages/company-package/company.model';
import { CompanyService } from '../../../shared/packages/company-package/company.service';

import { Folder } from '../../../shared/packages/folder-package/folder.model';
import { Document } from '../../../shared/packages/document-package/document.model';
import { WorkFunctionUpdateBody } from '../../../shared/packages/work-function-package/interface/work-function-api-response.interface';
import { isWorkFunction } from '../../../shared/packages/work-function-package/interface/work-function.interface';
import { WorkFunction } from '../../../shared/packages/work-function-package/work-function.model';
import { WorkFunctionService } from '../../../shared/packages/work-function-package/work-function.service';

@Component({
  selector: 'cim-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.css']
})
export class ItemListComponent implements OnInit {
    @Output() cancelAddItems: EventEmitter<boolean> = new EventEmitter();
    @Output() saveItemsDone: EventEmitter<WorkFunction|Company> = new EventEmitter();
    @Input() mainWorkFunction: WorkFunction;
    public items = [];
    public itemsSelected: (Document|Folder)[];

    private _parent: WorkFunction | Company;

    @Input()
    set parent(parent: WorkFunction | Company) {
        this._parent = parent;
    }

    get parent(): WorkFunction|Company {
        return this._parent;
    }

    constructor(private workFunctionService: WorkFunctionService, private companyService: CompanyService) { }

    ngOnInit() {
        this.getAvailableItems();
    }

    isFolder(item: any) {
        return item instanceof Folder;
    }

    cancelList(e: MouseEvent) {
        e.stopPropagation();
        e.preventDefault();
        this.cancelAddItems.emit(true);
    }

    saveItems(e: MouseEvent) {
        e.stopPropagation();
        e.preventDefault();
        if (isWorkFunction(this.parent)) {
            this.workFunctionService.updateWorkFunction(<WorkFunction>this.parent, this.getPostData()).subscribe(parent => {
                this.parent.addItems(this.itemsSelected);
                this.saveItemsDone.emit(parent);
            });
        } else {
            this.companyService.updateCompany(this.parent, <CompanyApiUpdataData>this.getPostData(), [this.mainWorkFunction.parent.id])
                .subscribe(parent => {
                    this.parent.addItems(this.itemsSelected);
                    this.saveItemsDone.emit(parent);
                });
        }
    }

    private getAvailableItems(): void {
        combineLatest(
            this.parent.items,
            this.mainWorkFunction.items
        ).subscribe(([items, mainWorkFunctionItems]) => {
            this.items = mainWorkFunctionItems.filter(mainWorkFunctionItem => {
                return !items.find(item => item.id === mainWorkFunctionItem.id);
            });
        });
    }

    private getPostData(): WorkFunctionUpdateBody {
        const postData: WorkFunctionUpdateBody = {};

        this.itemsSelected.forEach((item: Folder | Document) => {
            if (this.isFolder(item)) {
                postData.folders ? postData.folders.push((<Folder>item).id) : postData.folders = [(<Folder>item).id];
            } else {
                postData.documents ? postData.documents.push((<Document>item).id) : postData.documents = [(<Document>item).id];
            }
        });
        return postData;
    }

}
