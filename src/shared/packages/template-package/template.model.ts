import { TemplateItemInterface, TemplateParentItemInterface } from './interface/template-api-response.interface';

export class Template {
    private _id: number;
    private _name: string;
    private _folders: TemplateItemInterface[];
    private _subFolders: TemplateItemInterface[];
    private _documents: TemplateItemInterface[];
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

    get folders(): TemplateItemInterface[] {
        return this._folders;
    }

    set folders(value: TemplateItemInterface[]) {
        this._folders = value;
    }

    get subFolders(): TemplateItemInterface[] {
        return this._subFolders;
    }

    set subFolders(value: TemplateItemInterface[]) {
        this._subFolders = value;
    }

    get documents(): TemplateItemInterface[] {
        return this._documents;
    }

    set documents(value: TemplateItemInterface[]) {
        this._documents = value;
    }

    get subDocuments(): TemplateParentItemInterface[] {
        return this._subDocuments;
    }

    set subDocuments(value: TemplateParentItemInterface[]) {
        this._subDocuments = value;
    }
}
