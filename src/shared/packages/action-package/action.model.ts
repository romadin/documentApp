export class Action {
    private _id: number;
    private _description: string;
    private _actionHolder: string;
    private _week: string;
    private _status: string;
    private _comments: string;

    constructor() {}

    get id(): number {
        return this._id;
    }

    set id(value: number) {
        this._id = value;
    }

    get description(): string {
        return this._description;
    }

    set description(value: string) {
        this._description = value;
    }

    get actionHolder(): string {
        return this._actionHolder;
    }

    set actionHolder(value: string) {
        this._actionHolder = value;
    }

    get week(): string {
        return this._week;
    }

    set week(value: string) {
        this._week = value;
    }

    get status(): string {
        return this._status;
    }

    set status(value: string) {
        this._status = value;
    }

    get comments(): string {
        return this._comments;
    }

    set comments(value: string) {
        this._comments = value;
    }
}
