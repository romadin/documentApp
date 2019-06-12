import { Document } from '../document-package/document.model';
import { BehaviorSubject } from 'rxjs';

export class Folder {
    private _id: number;
    private _name: string;
    private _projectId: number;
    private _isOn: boolean;
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

    get projectId(): number {
        return this._projectId;
    }

    set projectId(value: number) {
        this._projectId = value;
    }

    get isOn(): boolean {
        return this._isOn;
    }

    set isOn(value: boolean) {
        this._isOn = value;
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

    get subFolders(): Folder[] {
        return this._subFolders;
    }

    set subFolder(subFolder: Folder) {
        this._subFolders.push(subFolder);
    }

    set subFolders(subFolders: Folder[]) {
        this._subFolders = subFolders;
    }

    public addSubFolder(folder: Folder): void {
        this._subFolders.push(folder);
    }

    get isMainFolder(): boolean {
        return this._isMain;
    }

    set isMainFolder(value: boolean) {
        this._isMain = value;
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

    get parentFolders(): BehaviorSubject<Folder[]> {
        return this._parentFolders;
    }

    set parentFolders(value: BehaviorSubject<Folder[]>) {
        this._parentFolders = value;
    }
}
