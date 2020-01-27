import { Observable } from 'rxjs';
import { WorkFunction } from '../work-function-package/work-function.model';

export class Chapter {
    private _id: number;
    private _name: string;
    private _content: string;
    private _parent: Chapter | WorkFunction;
    private _chapters: Observable<Chapter[]>;
    private _order: number;

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

    get content(): string {
        return this._content;
    }

    set content(value: string) {
        this._content = value;
    }

    get parent(): Chapter | WorkFunction {
        return this._parent;
    }

    set parent(value: Chapter | WorkFunction) {
        this._parent = value;
    }

    get chapters(): Observable<Chapter[]> {
        return this._chapters;
    }

    set chapters(value: Observable<Chapter[]>) {
        this._chapters = value;
    }

    get order(): number {
        return this._order;
    }

    set order(value: number) {
        this._order = value;
    }
}
