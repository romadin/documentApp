import { ApiProjectResponse } from './api-project.interface';
import { Organisation } from '../organisation-package/organisation.model';

export class Project {
    private _id: number;
    private _name: string;
    private _agendaId: number;
    private _actionListId: number;
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

    public getAgendaId(): number {
        return this._agendaId;
    }

    public setAgendaId(value: number) {
        this._agendaId = value;
    }

    public getActionListId(): number {
        return this._actionListId;
    }

    public setActionListId(value: number) {
        this._actionListId = value;
    }


    get organisation(): Organisation {
        return this._organisation;
    }

    set organisation(value: Organisation) {
        this._organisation = value;
    }

    public update(data: ApiProjectResponse): void {
        this.setId(data.id);
        this.setName(data.name);
        this.setAgendaId(data.agendaId);
        this.setActionListId(data.actionListId);
    }

}
