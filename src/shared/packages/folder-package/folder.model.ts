import { Document } from '../document-package/document.model';
import { BehaviorSubject, Observable } from 'rxjs';

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

    public constructor() {
        //
    }

    get id(): number {
        return this._id;
    }

    set id(value: number) {
        this._id = value;
    }

    public getName(): string {
        return this._name;
    }

    public setName(value: string) {
        this._name = value;
    }

    public getProjectId(): number {
        return this._projectId;
    }

    public setProjectId(value: number) {
        this._projectId = value;
    }

    public getIsOn(): boolean {
        return this._isOn;
    }

    public setOn(value: boolean) {
        this._isOn = value;
    }

    public getDocuments(): BehaviorSubject<Document[]> {
        return this._documents;
    }

    public setDocuments(value: BehaviorSubject<Document[]>) {
        this._documents = value;
    }

    public addDocument(document: Document): void {
        this._documents.getValue().push(document);
        this.getDocuments().next(this._documents.getValue());
    }

    public getSubFolders(): Folder[] {
        return this._subFolders;
    }

    public setSubFolder(subFolder: Folder) {
        this._subFolders.push(subFolder);
    }

    public setSubFolders(subFolders: Folder[]) {
        this._subFolders = subFolders;
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

    public update(data): void {
        this.id = data.id;
        this.setName(data.name);
        this.setDocuments(data.documents);
    }

}
