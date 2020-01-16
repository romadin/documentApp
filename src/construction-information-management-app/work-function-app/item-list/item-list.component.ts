import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { combineLatest } from 'rxjs';
import { CompanyApiUpdateData } from '../../../shared/packages/company-package/interface/company-api-response.interface';
import { Company } from '../../../shared/packages/company-package/company.model';
import { CompanyService } from '../../../shared/packages/company-package/company.service';

import { Document } from '../../../shared/packages/document-package/document.model';
import { WorkFunctionUpdateBody } from '../../../shared/packages/work-function-package/interface/work-function-api-response.interface';
import { isWorkFunction } from '../../../shared/packages/work-function-package/interface/work-function.interface';
import { WorkFunction } from '../../../shared/packages/work-function-package/work-function.model';
import { WorkFunctionService } from '../../../shared/packages/work-function-package/work-function.service';
import { DocumentService } from '../../../shared/packages/document-package/document.service';

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
    public itemsSelected: Document[];

    private _parent: WorkFunction | Company;

    @Input()
    set parent(parent: WorkFunction | Company) {
        this._parent = parent;
    }

    get parent(): WorkFunction|Company {
        return this._parent;
    }

    constructor(private workFunctionService: WorkFunctionService, private companyService: CompanyService, private documentService: DocumentService) { }

    ngOnInit() {
        this.getAvailableItems();
    }

    cancelList(e: MouseEvent) {
        e.stopPropagation();
        e.preventDefault();
        this.cancelAddItems.emit(true);
    }

    saveItems(e: MouseEvent) {
        e.stopPropagation();
        e.preventDefault();
        if (this.itemsSelected && this.itemsSelected.length > 0) {
            if (isWorkFunction(this.parent)) {
                this.documentService.postDocuments(<any>this.getPostData(), { workFunctionId: this.parent.id }).subscribe();
            } else {
                const postData: CompanyApiUpdateData = <CompanyApiUpdateData>this.getPostData();
                postData.workFunctionId = this.parent.parent.id;

                this.companyService.updateCompany(<Company>this.parent, postData , [this.mainWorkFunction.parent.id])
                    .subscribe(parent => {
                        this.saveItemsDone.emit(parent);
                    });
            }
        }
    }

    private getAvailableItems(): void {
        combineLatest(
            this.parent.documents,
            this.mainWorkFunction.documents
        ).subscribe(([items, mainWorkFunctionItems]) => {
            this.items = mainWorkFunctionItems.filter(mainWorkFunctionItem => {
                return !items.find(item => item.id === mainWorkFunctionItem.id);
            });
        });
    }

    private getPostData(): WorkFunctionUpdateBody {
        const postData: WorkFunctionUpdateBody = {};

        this.itemsSelected.forEach((item: Document) => {
            postData.documents ? postData.documents.push((<Document>item).id) : postData.documents = [(<Document>item).id];
        });
        return postData;
    }

}
