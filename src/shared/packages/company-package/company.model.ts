import { BehaviorSubject } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { Document } from '../document-package/document.model';
import { Folder } from '../folder-package/folder.model';

export class Company {
    private _id: number;
    private _name: string;
    private _folders: BehaviorSubject<Folder[]>;
    private _documents: BehaviorSubject<Document[]>;
    private _items: BehaviorSubject<(Document | Folder)[]>;

    constructor() {}

    get id(): number {
        return this._id;
    }

    set id(value: number) {
        this._id = value;
    }

    get name(): string {
        return this._name;
    }

    set name(value: string) {
        this._name = value;
    }

    get folders(): BehaviorSubject<Folder[]> {
        return this._folders;
    }

    set folders(value: BehaviorSubject<Folder[]>) {
        this._folders = value;
    }

    get documents(): BehaviorSubject<Document[]> {
        return this._documents;
    }

    set documents(value: BehaviorSubject<Document[]>) {
        this._documents = value;
    }

    get items(): BehaviorSubject<(Document | Folder)[]> {
        return this._items;
    }

    set items(value: BehaviorSubject<(Document | Folder)[]>) {
        this._items = value;
    }

    getItems(): BehaviorSubject<(Document | Folder)[]> {
        const workFunctionItems = this.items ? this.items : new BehaviorSubject<(Document|Folder)[]>([]);
        this.folders.pipe(mergeMap(folders => {
            const items: (Document | Folder)[] = folders;
            return this.documents.pipe(map(documents => items.concat(documents)));
        })).pipe(map(items => {
            items = items.sort((a, b) => a.order - b.order);
            workFunctionItems.next(items);
        })).subscribe();

        return workFunctionItems;
    }
}
