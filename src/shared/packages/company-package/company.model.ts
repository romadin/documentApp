import { BehaviorSubject } from 'rxjs';
import { Document } from '../document-package/document.model';
import { WorkFunction } from '../work-function-package/work-function.model';

export class Company {
    private _id: number;
    private _name: string;
    private _documents: {[workFunctionId: number]: BehaviorSubject<Document[]>} = {};
    private _items: BehaviorSubject<Document[]>;
    private _parent: WorkFunction|null;

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

    get documents(): BehaviorSubject<Document[]> {
        return this.parent ? this._documents[this.parent.id] : new BehaviorSubject([]) ;
    }

    set documents(value: BehaviorSubject<Document[]>) {
        this._documents[this.parent.id] = value;
    }

    get items(): BehaviorSubject<Document[]> {
        return this._items;
    }

    set items(value: BehaviorSubject<Document[]>) {
        this._items = value;
    }

    get parent(): WorkFunction | null {
        return this._parent;
    }

    set parent(value: WorkFunction | null) {
        this._parent = value;
    }

    // getItems(workFunction: WorkFunction): BehaviorSubject<(Document | Folder)[]> {
    //
    //     return workFunctionItems;
    // }

    addDocuments(items: Document[]): void {
        console.log('in the add items');
        const currentItems = this.documents.getValue();
        this.documents.next(currentItems.concat(items));
    }
}
