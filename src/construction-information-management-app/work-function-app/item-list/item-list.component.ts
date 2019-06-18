import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { combineLatest, forkJoin } from 'rxjs';

import { Folder } from '../../../shared/packages/folder-package/folder.model';
import { FolderPostData } from '../../../shared/packages/folder-package/api-folder.interface';
import { Document } from '../../../shared/packages/document-package/document.model';
import { WorkFunctionUpdateBody } from '../../../shared/packages/work-function-package/interface/work-function-api-response.interface';
import { WorkFunction } from '../../../shared/packages/work-function-package/work-function.model';
import { WorkFunctionService } from '../../../shared/packages/work-function-package/work-function.service';

@Component({
  selector: 'cim-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.css']
})
export class ItemListComponent implements OnInit {
    @Output() cancelAddItems: EventEmitter<boolean> = new EventEmitter();
    @Output() saveItemsDone: EventEmitter<WorkFunction> = new EventEmitter();
    @Input() mainWorkFunction: WorkFunction;
    public items = [];
    public itemsSelected: (Document|Folder)[];

    private _workFunction: WorkFunction;

    @Input()
    set workFunction(workFunction: WorkFunction) {
        this._workFunction = workFunction;
    }

    get workFunction(): WorkFunction {
        return this._workFunction;
    }

    constructor(private workFunctionService: WorkFunctionService) { }

    ngOnInit() {
        this.getAvailableItems();
    }

    public isFolder(item: any) {
        return item instanceof Folder;
    }

    public cancelList(e: MouseEvent) {
        e.stopPropagation();
        e.preventDefault();
        this.cancelAddItems.emit(true);
    }

    public saveItems(e: MouseEvent) {
        e.stopPropagation();
        e.preventDefault();
        this.workFunctionService.updateWorkFunction(this.workFunction, this.getPostData()).subscribe(workFunction => {
            this.workFunction.addItems(this.itemsSelected);
            this.saveItemsDone.emit(workFunction);
        });
    }

    private getAvailableItems(): void {
        combineLatest(
            this.workFunction.items,
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
