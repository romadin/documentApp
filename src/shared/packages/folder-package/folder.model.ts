import { Document } from '../document-package/document.model';
import { BehaviorSubject } from 'rxjs';

export class Folder {
    private _id: number;
    private _name: string;
    private _projectId: number;
    private _documents: BehaviorSubject<Document[]>;
    private _subFolders: Folder[] = [];
    private _isMain: boolean;
    private _order: number;
    private _fromTemplate: boolean;
    private _parentFolders: BehaviorSubject<Folder[]> = new BehaviorSubject<Folder[]>([]);

    public constructor() {
        //
    }

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

    get documents(): BehaviorSubject<Document[]> {
        return this._documents;
    }

    set documents(value: BehaviorSubject<Document[]>) {
        this._documents = value;
    }

    public addDocument(document: Document): void {
        this._documents.getValue().push(document);
        this.documents.next(this._documents.getValue());
    }

    set subFolder(subFolder: Folder) {
        this._subFolders.push(subFolder);
    }

    get subFolders(): Folder[] {
        return this._subFolders;
    }

    set subFolders(subFolders: Folder[]) {
        this._subFolders = subFolders;
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

}
