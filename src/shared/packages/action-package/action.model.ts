export class Action {
    private _id: number;
    private _code: string;
    private _description: string;
    private _actionHolder: string;
    private _week: number;
    private _isDone: string;
    private _comments: string;
    private _projectId: number;

    constructor() {}

    get id(): number {
        return this._id;
    }

    set id(value: number) {
        this._id = value;
    }

    get code(): string {
        return this._code;
    }

    set code(value: string) {
        this._code = value;
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

    get week(): number {
        return this._week;
    }

    set week(value: number) {
        this._week = value;
    }

    get isDone(): string {
        return this._isDone;
    }

    set isDone(value: string) {
        this._isDone = value;
    }

    get comments(): string {
        return this._comments;
    }

    set comments(value: string) {
        this._comments = value;
    }

    get projectId(): number {
        return this._projectId;
    }

    set projectId(value: number) {
        this._projectId = value;
    }
}
