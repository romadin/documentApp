import { TemplateParentItemInterface } from './interface/template-api-response.interface';
import { TemplateItem } from './templateItem.model';

export class Template {
    private _id: number;
    private _name: string;
    private _folders: TemplateItem[];
    private _subFolders: TemplateItem[];
    private _documents: TemplateItem[];
    private _subDocuments: TemplateParentItemInterface[];

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

    get folders(): TemplateItem[] {
        return this._folders;
    }

    set folders(value: TemplateItem[]) {
        this._folders = value;
    }

    get subFolders(): TemplateItem[] {
        return this._subFolders;
    }

    set subFolders(value: TemplateItem[]) {
        this._subFolders = value;
    }

    get documents(): TemplateItem[] {
        return this._documents;
    }

    set documents(value: TemplateItem[]) {
        this._documents = value;
    }

    get subDocuments(): TemplateParentItemInterface[] {
        return this._subDocuments;
    }

    set subDocuments(value: TemplateParentItemInterface[]) {
        this._subDocuments = value;
    }
}
