import { BehaviorSubject } from 'rxjs';

export class Chapter {
    private _id: number;
    private _name: string;
    private _content: string;
    private _parentChapterId: number;
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

    get content(): string {
        return this._content;
    }

    set content(value: string) {
        this._content = value;
    }

    get parentChapterId(): number {
        return this._parentChapterId;
    }

    set parentChapterId(value: number) {
        this._parentChapterId = value;
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
