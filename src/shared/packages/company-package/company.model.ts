import { BehaviorSubject, Observable } from 'rxjs';
import { Document } from '../document-package/document.model';
import { WorkFunction } from '../work-function-package/work-function.model';

export class Company {
    private _id: number;
    private _name: string;
    private _documents: {[workFunctionId: number]: Observable<Document[]>} = {};
    private _parent: WorkFunction | null;

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

    get documents(): Observable<Document[]> {
        return this.parent ? this._documents[this.parent.id] : new BehaviorSubject([]) ;
    }

    set documents(value: Observable<Document[]>) {
        this._documents[this.parent.id] = value;
    }

    get parent(): WorkFunction | null {
        return this._parent;
    }

    set parent(value: WorkFunction | null) {
        this._parent = value;
    }

    addDocuments(items: Document[]): void {
        console.log('fix add documents to company');
        // const currentItems = this.documents.getValue();
        // this.documents.next(currentItems.concat(items));
    }
}
