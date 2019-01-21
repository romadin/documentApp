import { Role } from '../role-package/role.model';

export class User {
    private _id: number;
    private _firstName: string;
    private _insertion: string;
    private _lastName: string;
    private _email: string;
    private _role: Role;

    public constructor() {
        //
    }

    public getId(): number {
        return this._id;
    }

    public setId(value: number) {
        this._id = value;
    }

    public getFirstName(): string {
        return this._firstName;
    }

    public setFirstName(value: string) {
        this._firstName = value;
    }

    public getInsertion(): string {
        return this._insertion;
    }

    public setInsertion(value: string) {
        this._insertion = value;
    }

    public getLastName(): string {
        return this._lastName;
    }

    public setLastName(value: string) {
        this._lastName = value;
    }

    public getEmail(): string {
        return this._email;
    }

    public setEmail(value: string) {
        this._email = value;
    }

    public getRole(): Role {
        return this._role;
    }

    public setRole(value: Role) {
        this._role = value;
    }

    public getFullName(): string {
        return this._firstName + ' ' + this._insertion !== '' ? this._insertion + ' ' + this._lastName : this._lastName;
    }
}
