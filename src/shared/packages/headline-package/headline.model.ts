import { Chapter } from '../chapter-package/chapter.model';
import { BehaviorSubject } from 'rxjs';

export class Headline {
    private _id: number;
    private _name: string;
    private _chapters: BehaviorSubject<Chapter[]>;
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

    get chapters(): BehaviorSubject<Chapter[]> {
        return this._chapters;
    }

    set chapters(value: BehaviorSubject<Chapter[]>) {
        this._chapters = value;
    }

    get order(): number {
        return this._order;
    }

    set order(value: number) {
        this._order = value;
    }
}
