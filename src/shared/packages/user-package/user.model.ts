import { Role } from '../role-package/role.model';

export class User {
    private _id: number;
    private _firstName: string;
    private _insertion: string | null;
    private _lastName: string;
    private _email: string;
    private _function: string;
    private _role: Role;
    private _projectsId: number[];

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

    public getInsertion(): string | null {
        return this._insertion;
    }

    public setInsertion(value: string | null) {
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

    public getFunction(): string {
        return this._function;
    }

    public setFunction(workFunction: string): void {
        this._function = workFunction;
    }

    public getRole(): Role {
        return this._role;
    }

    public setRole(role: Role) {
        this._role = role;
    }

    get projectsId(): number[] {
        return this._projectsId;
    }

    set projectsId(value: number[]) {
        this._projectsId = value;
    }

    public getFullName(): string {
        if (this.getInsertion()) {
            return this.getFirstName() + ' ' + this.getInsertion() + ' ' + this.getLastName();
        }
        return this.getFirstName() + ' ' + this.getLastName();
    }

    public isAdmin(): boolean {
        return this.getRole().getName() === 'admin';
    }
}
