import { BehaviorSubject } from 'rxjs';

export class Document {
    private _id: number;
    private _originalName: string;
    private _name: string;
    private _content: string;
    private _parentFolders: number[];
    private _order: number;
    private _fromTemplate: boolean;
    private _documents: BehaviorSubject<Document[]>;

    constructor() {}

    get id(): number {
        return this._id;
    }

    set id(value: number) {
        this._id = value;
    }

    get originalName(): string {
        return this._originalName;
    }

    set originalName(value: string) {
        this._originalName = value;
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

    get parentFolders(): number[] {
        return this._parentFolders;
    }

    set parentFolders(value: number[]) {
        this._parentFolders = value;
    }

    get documents(): BehaviorSubject<Document[]> {
        return this._documents;
    }

    set documents(value: BehaviorSubject<Document[]>) {
        this._documents = value;
    }

    get order(): number {
        return this._order;
    }

    set order(value: number) {
        this._order = value;
    }

    get fromTemplate(): boolean {
        return this._fromTemplate;
    }

    set fromTemplate(value: boolean) {
        this._fromTemplate = value;
    }

    addDocuments(newDocuments: Document[]) {
        let documents = this.documents.getValue();
        documents = documents.concat(newDocuments);
        this.documents.next(documents);
    }

    getName(): string {
        return this.name === null ? this.originalName : this.name;
    }
}
