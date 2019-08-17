import {
    AfterViewInit,
    Component,
    EventEmitter,
    Input, OnDestroy,
    Output, ViewChild,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AngularEditorConfig } from '@kolkov/angular-editor';

import { environment } from '../../../environments/environment';
import { ToastService } from '../../../shared/toast.service';
import { WorkFunction } from '../../../shared/packages/work-function-package/work-function.model';
import { Folder } from '../../../shared/packages/folder-package/folder.model';
import { User } from '../../../shared/packages/user-package/user.model';
import { DocumentService } from '../../../shared/packages/document-package/document.service';
import { DocPostData } from '../../../shared/packages/document-package/api-document.interface';
import { Document as DocumentFile} from '../../../shared/packages/document-package/document.model';

interface MouseSelection {
    selection: Selection;
    offset: number;
}
@Component({
    selector: 'cim-document-detail',
    templateUrl: './document-detail.component.html',
    styleUrls: ['./document-detail.component.css']
})
export class DocumentDetailComponent implements AfterViewInit, OnDestroy {
    @Input() workFunction: WorkFunction;
    @Input() parentFolder: Folder;
    @Input() currentUser: User;
    @Output() public closeEditForm: EventEmitter<boolean> = new EventEmitter();
    @ViewChild('editor') editor: any;
    documentForm: FormGroup = new FormGroup({
        name: new FormControl('')
    });
    editorConfig: AngularEditorConfig = {
        editable: true,
        spellcheck: true,
        height: '20vh',
        minHeight: '5rem',
        placeholder: 'Voer je text in...',
        translate: 'no',
    };
    content = '';

    private table: HTMLElement;
    private tableDropDownWrapper: HTMLElement;
    private currentMouseSelection: MouseSelection;
    private formHasChanged = false;
    private startValue = '';
    private _document: DocumentFile;

    @Input()
    set document(document: DocumentFile) {
        this._document = document;
        this.editorConfig.uploadUrl = environment.API_URL + '/documents/' + document.id + '/image?token=' + sessionStorage.getItem('token');
        this.updateForm();
    }

    get document(): DocumentFile {
        return this._document;
    }

    constructor(private documentService: DocumentService,
                private toast: ToastService) { }

    ngAfterViewInit() {
        this.onFormChanges();
        this.addToolbarButton();
        document.addEventListener('click', this.checkForOutsideClick);
    }

    ngOnDestroy() {
        document.removeEventListener('click', this.checkForOutsideClick);
    }

    onSubmit() {
        if (this.documentForm.valid && this.formHasChanged) {
            const postData: DocPostData = {
                name: this.documentForm.controls.name.value,
                content: this.content,
            };
            if ( this.document ) {
                this.documentService.updateDocument(this.document, postData, this.workFunction).subscribe((document) => {
                    if ( document ) {
                        this.document = document;
                        this.toast.showSuccess('Hoofdstuk: ' + this.document.getName() + ' is bewerkt', 'Bewerkt');
                    }
                });
            } else {
                this.documentService.postDocument(postData, this.workFunction, this.parentFolder).subscribe((document) => {
                    if ( document ) {
                        if (this.parentFolder) {
                            this.parentFolder.addDocument(document);
                        } else {
                            this.workFunction.addDocument(document);
                        }
                        this.document = document;
                        this.closeEditForm.emit(true);
                        this.toast.showSuccess('Hoofdstuk: ' + document.getName() + ' is toegevoegd', 'Toegevoegd');
                    }
                });
            }
        }
    }

    onCloseView(event?: MouseEvent): void {
        if (event) {
            event.stopPropagation();
            event.preventDefault();
        }
        this.closeEditForm.emit(true);
    }
    dataChanged(e): void {
        // match if there is a new image with no style
        const imageMatch = this.content.match(/(<img(?!.*?style=(['"]).*?\2)[^>]*)(>)/g);
        if (imageMatch && imageMatch.length > 0) {
            const imageString = imageMatch[0];
            // add style
            const imageWithStyle = imageString.replace('<img ', '<img style="width:100%; height:auto;"');
            this.content = this.content.replace(imageString, imageWithStyle);
        }

        this.formHasChanged = this.content !== this.startValue;
    }

    private addToolbarButton() {
        const toolbar = document.getElementsByClassName('angular-editor-toolbar')[0];
        this.tableDropDownWrapper = document.createElement('div');
        const dropDown = this.makeTableDropDown();
        const button = document.createElement('button');
        const icon = document.createElement('i');
        icon.classList.add('material-icons');
        icon.append(document.createTextNode('table_chart'));

        button.classList.add('tableShowDropDown');
        button.onclick = this.showTableMenu.bind(this);

        button.append(icon);
        this.tableDropDownWrapper.classList.add('tableDropDownWrapper');
        this.tableDropDownWrapper.setAttribute('id', 'tableDropDownWrapper');
        this.tableDropDownWrapper.append(button);
        this.tableDropDownWrapper.append(dropDown);
        toolbar.append(this.tableDropDownWrapper);
    }

    private showTableMenu(e: MouseEvent) {
        e.preventDefault();
        e.stopPropagation();
        this.currentMouseSelection = { selection: getSelection(), offset: 0 };
        this.prepTable();

        const selection = this.currentMouseSelection.selection;
        const range = selection.getRangeAt(0);
        const textArea = this.editor.textArea.nativeElement;

        if (textArea.compareDocumentPosition(range.startContainer) !== Node.DOCUMENT_POSITION_PRECEDING &&
            textArea.compareDocumentPosition(range.endContainer) !== Node.DOCUMENT_POSITION_FOLLOWING) {
            let endOffset = 0;

            textArea.childNodes.forEach(node => {
                endOffset += node.outerHTML ? node.outerHTML.length : node.textContent.length;
                if (node === selection.anchorNode || node === selection.anchorNode.parentElement) {
                    if (selection.anchorOffset === 0) {
                        this.currentMouseSelection.offset = endOffset;
                        return;
                    }
                    const rightSide = node.outerHTML.split(selection.anchorNode.textContent)[1];
                    const rightSideOffset = (<any>selection.anchorNode).length - selection.anchorOffset;
                    this.currentMouseSelection.offset = endOffset - rightSide.length - rightSideOffset;
                }
            });
        } else {
            this.currentMouseSelection.offset = 0;
        }

        const dropDown = this.tableDropDownWrapper.children[1];
        if (!dropDown.classList.contains('show')) {
            dropDown.classList.add('show');
        }
    }

    private addTable(columnsLength: number, rowsLength: number) {
        const rows = Array(rowsLength).fill('');
        const columns = Array(columnsLength).fill('');
        const tableBody = document.getElementById('tempTable') ? document.getElementById('tempTable').children[0] : null;
        const tableRows = Array.from( tableBody ? tableBody.children : this.table.children);

        if (tableRows.length === 0) {
            rows.forEach(() => {
                const row = document.createElement('tr');
                columns.forEach(() => {
                    row.append(this.makeColumn());
                });

                this.table.append(row);
            });
            this.spliceString(this.currentMouseSelection.offset, 0, this.table.outerHTML);
        } else if (tableRows.length < rowsLength) {
            // update oldRows.
            tableRows.forEach((row) => {
                this.addOrRemoveColumn(row, columnsLength);
            });

            // add a rows.
            const rowsToAddNumber = rowsLength - tableRows.length;
            for (let i = 0; i < rowsToAddNumber; i++) {
                const row = document.createElement('tr');
                this.addOrRemoveColumn(row, columnsLength);
                tableBody.append(row);
            }
        } else if (tableRows.length > rowsLength) {
            // remove rows.
            const rowsToRemoveNumber = tableRows.length - rowsLength;
            for (let i = 0; i < rowsToRemoveNumber; i++) {
                tableBody.children[tableBody.children.length - 1 - i].remove();
            }
        } else if (tableRows.length === rowsLength) {
            // only need to remove or add a column
            tableRows.forEach((row) => {
                this.addOrRemoveColumn(row, columnsLength);
            });
        }
    }

    private saveTable(e: Event): void {
        e.stopPropagation();
        e.preventDefault();
        const dropDown = this.tableDropDownWrapper.children[1];
        if (dropDown.classList.contains('show')) {
            dropDown.classList.remove('show');
        }

        document.getElementById('tempTable').removeAttribute('id');
        this.resetColorBlocksAndTable(<HTMLElement>dropDown, false);

        this.content = this.editor.textArea.nativeElement.innerHTML;
    }

    private makeTableDropDown(): Node {
        const dropDown = document.createElement('div');
        const maxColumnsAndRows = 5;
        const maxArray = new Array(maxColumnsAndRows).fill('');

        dropDown.classList.add('tableDropDown');
        dropDown.setAttribute('id',  'tableDropDown');
        dropDown.onmouseleave = () => this.resetColorBlocksAndTable(dropDown);
        dropDown.append(this.getLabel());

        maxArray.forEach((v, rowIndex) => {
            const row = document.createElement('div');
            row.classList.add('selectorRow');
            maxArray.forEach((x, value) => {
                const block = document.createElement('div');
                block.classList.add('selectorBlock');
                block.setAttribute('column',  (value + 1) +  '');
                block.setAttribute('row',  (rowIndex + 1) +  '');

                block.onmouseover = () => this.colorBlock(block);
                block.onclick = this.saveTable.bind(this);
                row.append(block);
            });
            dropDown.append(row);
        });

        return dropDown;
    }

    /**
     * Color the blocks form the drop down menu when clicked on table.
     */
    private colorBlock(currentBlock: HTMLElement) {
        const dropDown = document.getElementById('tableDropDown');
        const selectorRows = Array.from(dropDown.children).filter(row => row.classList.contains('selectorRow'));
        const rowNumber: number = parseInt(currentBlock.attributes['row'].value, 10);
        const columnNumber: number = parseInt(currentBlock.attributes['column'].value, 10);

        selectorRows.forEach((row, rowIndex) => {
            const blocks = Array.from(row.children);
            if (rowIndex + 1 <= rowNumber) {
                blocks.filter((value, index) => (index + 1 ) <= columnNumber).map(block => block.classList.add('show'));
            } else if (rowIndex + 1 > rowNumber) {
                // remove from bottom to top
                blocks.map(block => block.classList.remove('show'));
            }
            // remove from left to right
            blocks.filter((value, index) => (index + 1 ) > columnNumber).map(block => block.classList.remove('show'));
        });
        this.updateLabel(columnNumber, rowNumber);
        this.addTable(columnNumber, rowNumber);
    }

    private makeColumn(): HTMLElement {
        const column = document.createElement('td');
        column.style.borderCollapse = 'collapse';
        column.style.border = '1px solid #6d6d6d';
        return column;
    }

    private addOrRemoveColumn(row: Element, columnsLength: number) {
        if (row.children.length < columnsLength ) {
            // add column
            const columnsToAdd = columnsLength - row.children.length;
            for (let i = 0; i < columnsToAdd; i++) {
                row.append(this.makeColumn());
            }
        } else if (row.children.length > columnsLength) {
            // remove column
            const columnsToRemove = row.children.length - columnsLength;
            for (let i = 0; i < columnsToRemove; i++) {
                row.children[row.children.length - 1 - i].remove();
            }
        }
    }

    private resetColorBlocksAndTable(tableCreator: HTMLElement, resetContent = true): void {
        const rows = Array.from(tableCreator.children);
        rows.forEach((row) => {
            const blocks = Array.from(row.children);
            blocks.map(block => block.classList.remove('show'));
        });

        if (resetContent) {
            const regexString = this.table.outerHTML.replace(/\(/g, '\\(').replace(/\)/g, '\\)').replace(/\//g, '\\/');
            const regex = new RegExp(regexString, 'g');
            this.content = this.content.replace(regex, '');
        }
        this.prepTable();
        this.updateLabel(0, 0);
    }

    private updateLabel(columnNumber: number, rowNumber: number): void {
        document.getElementById('columnCounter').innerText = columnNumber + '';
        document.getElementById('rowCounter').innerText = rowNumber + '';
    }

    private prepTable(): void {
        this.table = document.createElement('table');
        this.table.setAttribute('id', 'tempTable');
        this.table.style.width = '100%';
        this.table.style.borderCollapse = 'collapse';
        this.table.style.tableLayout = 'fixed';
        this.table.style.wordBreak = 'break-word';
    }

    private getLabel(): HTMLElement {
        const labelWrapper = document.createElement('div');
        const x = document.createTextNode('X');
        const label = document.createElement('span');
        label.append(document.createTextNode('Tabel'));

        const columnLabel = document.createElement('span');
        columnLabel.id = 'columnCounter';
        columnLabel.append(document.createTextNode('0'));

        const rowLabel = document.createElement('span');
        rowLabel.id = 'rowCounter';
        rowLabel.append(document.createTextNode('0'));

        labelWrapper.classList.add('labelWrapper');
        labelWrapper.append(label);
        labelWrapper.append(columnLabel);
        labelWrapper.append(x);
        labelWrapper.append(rowLabel);

        return labelWrapper;
    }

    private updateForm(): void {
        this.documentForm.controls.name.setValue(this.document.getName());
        this.startValue = this.content = this.document.content !== null ? this.document.content : '';
    }

    private spliceString (start, delCount, newSubStr) {
        this.content = this.content.slice(0, start) + newSubStr + this.content.slice(start + Math.abs(delCount));
    }

    private onFormChanges() {
        let oldValue = this.documentForm.value;
        this.documentForm.valueChanges.subscribe(value => {
            for (const key in value) {
                if (value.hasOwnProperty(key) && oldValue.hasOwnProperty(key)) {
                    if (value[key] !== oldValue[key]) {
                        this.formHasChanged = true;
                        oldValue = value;
                        break;
                    }
                    this.formHasChanged = false;
                }
            }
        });
    }

    private checkForOutsideClick() {
        const table = document.getElementById('tableDropDown');
        if (table && table.classList.contains('show')) {
            table.classList.remove('show');
        }
    }
}
