export class Chapter {
    private _id: number;
    private _name: string;
    private _content: string;
    private _headlineId: number;
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

    get headlineId(): number {
        return this._headlineId;
    }

    set headlineId(value: number) {
        this._headlineId = value;
    }

    get order(): number {
        return this._order;
    }

    set order(value: number) {
        this._order = value;
    }
}
