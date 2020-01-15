import { Observable } from 'rxjs';
import { Company } from '../company-package/company.model';
import { Document } from '../document-package/document.model';

import { Project } from '../project-package/project.model';
import { Template } from '../template-package/template.model';
import { Chapter } from '../chapter-package/chapter.model';

export class WorkFunction {
    private _id: number;
    private _name: string;
    private _isMainFunction: boolean;
    private _order: number;
    private _parent: Template|Project;
    private _chapters: Observable<Chapter[]>;
    private _documents: Observable<Document[]>;
    private _on: boolean;
    private _fromTemplate: boolean;
    private _companies: Company[];

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

    get chapters(): Observable<Chapter[]> {
        return this._chapters;
    }

    set chapters(value: Observable<Chapter[]>) {
        this._chapters = value;
    }

    get documents(): Observable<Document[]> {
        return this._documents;
    }

    set documents(value: Observable<Document[]>) {
        this._documents = value;
    }

    get on(): boolean {
        return this._on;
    }

    set on(value: boolean) {
        this._on = value;
    }

    get fromTemplate(): boolean {
        return this._fromTemplate;
    }

    set fromTemplate(value: boolean) {
        this._fromTemplate = value;
    }

    get companies(): Company[] {
        return this._companies;
    }

    set companies(value: Company[]) {
        this._companies = value;
    }

    addDocuments(newDocuments: Document[]) {
        console.log('fix add documents');
        // let documents = this.documents.getValue();
        // documents = documents.concat(newDocuments);
        // this.documents.next(documents);
    }
}
