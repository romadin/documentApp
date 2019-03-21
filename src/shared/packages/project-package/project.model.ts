import { ProjectUpdateData } from './api-project.interface';
import { Organisation } from '../organisation-package/organisation.model';

export class Project {
    private _id: number;
    private _name: string;
    private _organisation: Organisation;

    public constructor() {
        //
    }

    public getId(): number {
        return this._id;
    }

    public setId(value: number) {
        this._id = value;
    }

    public getName(): string {
        return this._name;
    }

    public setName(value: string) {
        this._name = value;
    }

    get organisation(): Organisation {
        return this._organisation;
    }

    set organisation(value: Organisation) {
        this._organisation = value;
    }

    public update(data: ProjectUpdateData): void {
        this.setName(data.name);
    }

}
