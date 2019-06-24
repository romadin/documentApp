import { Subject } from 'rxjs';
import { Module } from '../module-package/module.model';

export class Organisation {
    private _id: number;
    private _name: string;
    private _primaryColor: string;
    private _secondaryColor: string;
    private _maxUser: number;
    private _logo: Subject<Blob>;
    private _modules: Module[];

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

    get primaryColor(): string {
        return this._primaryColor;
    }

    set primaryColor(value: string) {
        this._primaryColor = value;
    }

    get secondaryColor(): string {
        return this._secondaryColor;
    }

    set secondaryColor(value: string) {
        this._secondaryColor = value;
    }

    get maxUser(): number {
        return this._maxUser;
    }

    set maxUser(value: number) {
        this._maxUser = value;
    }

    get logo(): Subject<Blob> {
        return this._logo;
    }

    set logo(value: Subject<Blob>) {
        this._logo = value;
    }

    get modules(): Module[] {
        return this._modules;
    }

    set modules(value: Module[]) {
        this._modules = value;
    }
}
