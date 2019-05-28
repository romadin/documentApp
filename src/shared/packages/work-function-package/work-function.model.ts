import { Template } from '../template-package/template.model';
import { Headline } from '../headline-package/headline.model';
import { Chapter } from '../chapter-package/chapter.model';
import { BehaviorSubject } from 'rxjs';

export class WorkFunction {
    private _id: number;
    private _name: string;
    private _isMainFunction: boolean;
    private _order: number;
    private _template: Template;
    private _headlines: BehaviorSubject<Headline[]>;
    private _chapters: BehaviorSubject<Chapter[]>;

    constructor() { }

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

    get isMainFunction(): boolean {
        return this._isMainFunction;
    }

    set isMainFunction(value: boolean) {
        this._isMainFunction = value;
    }

    get order(): number {
        return this._order;
    }

    set order(value: number) {
        this._order = value;
    }

    get template(): Template {
        return this._template;
    }

    set template(value: Template) {
        this._template = value;
    }

    get headlines(): BehaviorSubject<Headline[]> {
        return this._headlines;
    }

    set headlines(value: BehaviorSubject<Headline[]>) {
        this._headlines = value;
    }

    get chapters(): BehaviorSubject<Chapter[]> {
        return this._chapters;
    }

    set chapters(value: BehaviorSubject<Chapter[]>) {
        this._chapters = value;
    }
}
