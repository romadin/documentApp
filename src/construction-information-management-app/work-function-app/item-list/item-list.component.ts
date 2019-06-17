import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { Folder } from '../../../shared/packages/folder-package/folder.model';
import { FolderService } from '../../../shared/packages/folder-package/folder.service';
import { FolderPostData } from '../../../shared/packages/folder-package/api-folder.interface';
import { Document } from '../../../shared/packages/document-package/document.model';
import { WorkFunction } from '../../../shared/packages/work-function-package/work-function.model';
import { WorkFunctionService } from '../../../shared/packages/work-function-package/work-function.service';

@Component({
  selector: 'cim-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.css']
})
export class ItemListComponent implements OnInit {
    @Output() cancelAddItems: EventEmitter<boolean> = new EventEmitter();
    @Output() saveItemsDone: EventEmitter<Folder> = new EventEmitter();
    @Input() mainWorkFunction: WorkFunction;
    public items = [];
    public itemsSelected;

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
        this.getAvailableFolder(this.mainWorkFunction.folders.getValue(), this.workFunction.folders.getValue());

        this.getDocumentAvailable().then((documents: Document[]) => {
            documents.forEach(document => this.items.push(document));
        });
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
        this.workFunctionService.updateWorkFunction(this.workFunction, this.preparePostData(this.itemsSelected)).subscribe(workFunction => {
            // this.saveItemsDone.emit(workFunction);
            console.log(workFunction);
        });
    }

    private getDocumentAvailable(): Promise<any[]> {
        return new Promise((resolve) => {
            this.mainWorkFunction.documents.subscribe((documents) => {
                this.workFunction.documents.subscribe((currentDocs) => {
                    if (currentDocs.length === 0 ) {
                        return resolve(documents);
                    }
                    return resolve(this.removeItemMainArrayFromSubArray(documents, currentDocs));
                });
            });
        });
    }

    private getAvailableFolder(mainSubFolders: Folder[], currentSubFolders: Folder[] ): void {
        if (currentSubFolders.length === 0 ) {
            this.items = this.items.concat(mainSubFolders);
            return;
        }

        this.items = this.items.concat(this.removeItemMainArrayFromSubArray(mainSubFolders, currentSubFolders));
    }

    private removeItemMainArrayFromSubArray(mainArray, subArray): (Folder[] | Document[]) {
        /** We do this so that we dont copy the array by reference. */
        const tempMainSubFolders = mainArray.concat();
        const tempCurrentSubFolders = subArray.concat();

        tempCurrentSubFolders.forEach((subItem) => {
            tempMainSubFolders.forEach((item, key) => {
                if ( item.id === subItem.id ) {
                    tempMainSubFolders.splice(key, 1);
                }
            });
        });
        return tempMainSubFolders;
    }

    private preparePostData(itemsSelected): FolderPostData {
        const postData = {};

        itemsSelected.forEach((item: Folder | Document) => {
            // if (this.isFolder(item)) {
            //     postData. ? postData.subFolders.push((<Folder>item).id) : postData.subFolders = [(<Folder>item).id];
            // } else {
            //     postData.documents ? postData.documents.push((<Document>item).id) : postData.documents = [(<Document>item).id];
            // }
        });
        return postData;
    }

}
