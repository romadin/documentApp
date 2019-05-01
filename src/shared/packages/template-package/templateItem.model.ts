export type templateItemType = 'folder' | 'document';

export class TemplateItem {
    private _name: string;
    private _content: string;
    private _type: templateItemType;
    private _order?: number;

    constructor() { }

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

    get type(): templateItemType {
        return this._type;
    }

    set type(value: templateItemType) {
        this._type = value;
    }

    get order(): number {
        return this._order;
    }

    set order(value: number) {
        this._order = value;
    }
}
