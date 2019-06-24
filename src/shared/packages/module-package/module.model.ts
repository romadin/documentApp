export class Module {
    private _id: number;
    private _name: string;
    private _on: boolean;
    private _restrictions: any;

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

    get on(): boolean {
        return this._on;
    }

    set on(value: boolean) {
        this._on = value;
    }

    get restrictions(): any {
        return this._restrictions;
    }

    set restrictions(value: any) {
        this._restrictions = value;
    }
}
