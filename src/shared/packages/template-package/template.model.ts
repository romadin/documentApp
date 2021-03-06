import { WorkFunction } from '../work-function-package/work-function.model';
import { Observable } from 'rxjs';

export class Template {
    private _id: number;
    private _name: string;
    private _organisationId: number;
    private _isDefault: boolean;
    private _workFunctions: Observable<WorkFunction[]>;

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

    get organisationId(): number {
        return this._organisationId;
    }

    set organisationId(value: number) {
        this._organisationId = value;
    }

    get isDefault(): boolean {
        return this._isDefault;
    }

    set isDefault(value: boolean) {
        this._isDefault = value;
    }
    
    get workFunctions(): Observable<WorkFunction[]> {
        return this._workFunctions;
    }
    
    set workFunctions(value: Observable<WorkFunction[]>) {
        this._workFunctions = value;
    }
}
