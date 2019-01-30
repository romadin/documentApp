import { BehaviorSubject } from 'rxjs';

import { Folder } from '../folder-package/folder.model';

export class Document {
    private _id: number;
    private _name: string;
    private _content: string;
    private _parentFolders: BehaviorSubject<Folder[]>;

    constructor() {}

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

    get content(): string {
        return this._content;
    }

    set content(value: string) {
        this._content = value;
    }

    get parentFolders(): BehaviorSubject<Folder[]> {
        return this._parentFolders;
    }

    set parentFolders(value: BehaviorSubject<Folder[]>) {
        this._parentFolders = value;
    }
}
