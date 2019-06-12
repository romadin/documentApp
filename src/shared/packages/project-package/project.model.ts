import { BehaviorSubject } from 'rxjs';
import { WorkFunction } from '../work-function-package/work-function.model';
import { ProjectUpdateData } from './api-project.interface';
import { Organisation } from '../organisation-package/organisation.model';

export class Project {
    private _id: number;
    private _name: string;
    private _organisation: Organisation;
    private _workFunctions: BehaviorSubject<WorkFunction[]> = new BehaviorSubject<WorkFunction[]>([]);

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

    get organisation(): Organisation {
        return this._organisation;
    }

    set organisation(value: Organisation) {
        this._organisation = value;
    }

    get workFunctions(): BehaviorSubject<WorkFunction[]> {
        return this._workFunctions;
    }

    set workFunctions(value: BehaviorSubject<WorkFunction[]>) {
        this._workFunctions = value;
    }

    public update(data: ProjectUpdateData): void {
        this.name = data.name;
    }

}
