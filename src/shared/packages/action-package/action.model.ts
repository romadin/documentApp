import { ApiActionEditPostData } from './api-action.interface';
import { User } from '../user-package/user.model';

export class Action {
    private _id: number;
    private _code: number;
    private _description: string;
    private _actionHolder: User;
    private _week: number;
    private _isDone: boolean;
    private _comments: string;
    private _projectId: number;

    constructor() {}

    get id(): number {
        return this._id;
    }

    set id(value: number) {
        this._id = value;
    }

    get code(): number {
        return this._code;
    }

    set code(value: number) {
        this._code = value;
    }

    get description(): string {
        return this._description;
    }

    set description(value: string) {
        this._description = value;
    }

    get actionHolder(): User {
        return this._actionHolder;
    }

    set actionHolder(value: User) {
        this._actionHolder = value;
    }

    get week(): number {
        return this._week;
    }

    set week(value: number) {
        this._week = value;
    }

    get isDone(): boolean {
        return this._isDone;
    }

    set isDone(value: boolean) {
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

    get status(): string {
        return this.isDone ? 'Klaar' : 'In behandeling';
    }

    public update(data: ApiActionEditPostData): void {
        for ( const key in data ) {
            if (data.hasOwnProperty(key)) {
                this[key] = data[key];
            }
        }
    }
}
