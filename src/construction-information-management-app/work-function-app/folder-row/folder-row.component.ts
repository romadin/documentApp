import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Company } from '../../../shared/packages/company-package/company.model';
import { isCompany } from '../../../shared/packages/company-package/interface/company.interface';


import { FolderService } from '../../../shared/packages/folder-package/folder.service';
import { Folder } from '../../../shared/packages/folder-package/folder.model';
import { User } from '../../../shared/packages/user-package/user.model';
import { Document } from '../../../shared/packages/document-package/document.model';
import { isWorkFunction } from '../../../shared/packages/work-function-package/interface/work-function.interface';
import { WorkFunction } from '../../../shared/packages/work-function-package/work-function.model';
import { ToastService } from '../../../shared/toast.service';

@Component({
  selector: 'cim-folder-row',
  templateUrl: './folder-row.component.html',
  styleUrls: ['./folder-row.component.css']
})
export class FolderRowComponent implements OnInit {
    @Input() parent: WorkFunction | Company;
    @Input() folder: Folder;
    @Input() currentUser: User;
    @Input() redirectUrl: string;
    @Output() sendDocumentToFolder: EventEmitter<Document> = new EventEmitter<Document>();
    @Output() sendFolderToFolderComponent: EventEmitter<Folder> = new EventEmitter<Folder>();
    @Output() closeRightView: EventEmitter<boolean> = new EventEmitter<boolean>();

    public documents: Document[];


    constructor(
        private folderService: FolderService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private toast: ToastService,
    ) {
    }

    public ngOnInit(): void {
        this.folder.documents.subscribe((documents) => {
            this.documents = documents;
        });
    }

    public redirectToFolderOrShowDocs(e: MouseEvent) {
        e.stopPropagation();
        e.preventDefault();
        if (this.redirectUrl) {
            this.router.navigate([this.redirectUrl], {relativeTo: this.activatedRoute});
            return;
        }
    }


    public editFolder(e: MouseEvent) {
        e.stopPropagation();
        e.preventDefault();
        this.sendFolderToFolderComponent.emit(this.folder);
    }

    deleteFolder(e: Event): void {
        e.preventDefault();
        e.stopPropagation();
        const params = {};
        isWorkFunction(this.parent) ? params['workFunctionId'] = this.parent.id : params['companyId'] = this.parent.id;
        this.folderService.deleteFolder(this.folder, params).subscribe((deleted) => {
            if (deleted) {
                const folders = this.parent.folders.getValue();
                folders.splice(folders.findIndex((subFolder => subFolder === this.folder)), 1);
                this.parent.folders.next(folders);
                this.toast.showSuccess('Hoofdstuk: ' + this.folder.name + ' is verwijderd', 'Verwijderd');
                this.closeRightView.emit(true);
            }
        });
    }

    showDeleteButton(): boolean {
        if (this.currentUser.isAdmin()) {
            if (!this.folder.fromTemplate) {
                return true;
            }
            return (isWorkFunction(this.parent) && !this.parent.isMainFunction) || !isWorkFunction(this.parent);
        }
        return false;
    }

    public sendOnDocumentEdit(document: Document): void {
        this.sendDocumentToFolder.emit(document);
    }
}
