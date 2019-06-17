import { BehaviorSubject } from 'rxjs';
import { Document } from '../document-package/document.model';
import { Folder } from '../folder-package/folder.model';

import { Project } from '../project-package/project.model';
import { Template } from '../template-package/template.model';
import { Headline } from '../headline-package/headline.model';
import { Chapter } from '../chapter-package/chapter.model';

export class WorkFunction {
    private _id: number;
    private _name: string;
    private _isMainFunction: boolean;
    private _order: number;
    private _parent: Template|Project;
    private _headlines: BehaviorSubject<Headline[]>;
    private _chapters: BehaviorSubject<Chapter[]>;
    private _folders: BehaviorSubject<Folder[]>;
    private _documents: BehaviorSubject<Document[]>;
    private _on: boolean;

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

    get parent(): Template|Project {
        return this._parent;
    }

    set parent(value: Template|Project) {
        this._parent = value;
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

    get folders(): BehaviorSubject<Folder[]> {
        return this._folders;
    }

    set folders(value: BehaviorSubject<Folder[]>) {
        this._folders = value;
    }

    get documents(): BehaviorSubject<Document[]> {
        return this._documents;
    }

    set documents(value: BehaviorSubject<Document[]>) {
        this._documents = value;
    }

    get on(): boolean {
        return this._on;
    }

    set on(value: boolean) {
        this._on = value;
    }

    addDocument(document: Document) {
        const documents = this.documents.getValue();
        documents.push(document);
        this.documents.next(documents);
    }
}
