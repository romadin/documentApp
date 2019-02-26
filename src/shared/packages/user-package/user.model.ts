import { Subject } from 'rxjs';
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
    private _phoneNumber: number;
    private _image: Subject<Blob>;

    public constructor() {
        //
    }

    get id(): number {
        return this._id;
    }

    set id(value: number) {
        this._id = value;
    }

    get firstName(): string {
        return this._firstName;
    }

    set firstName(value: string) {
        this._firstName = value;
    }

    get insertion(): string | null {
        return this._insertion;
    }

    set insertion(value: string | null) {
        this._insertion = value;
    }

    get lastName(): string {
        return this._lastName;
    }

    set lastName(value: string) {
        this._lastName = value;
    }

    get email(): string {
        return this._email;
    }

    set email(value: string) {
        this._email = value;
    }

    get function(): string {
        return this._function;
    }

    set function(value: string) {
        this._function = value;
    }

    get role(): Role {
        return this._role;
    }

    set role(value: Role) {
        this._role = value;
    }

    get projectsId(): number[] {
        return this._projectsId;
    }

    set projectsId(value: number[]) {
        this._projectsId = value;
    }

    get phoneNumber(): number {
        return this._phoneNumber;
    }

    set phoneNumber(value: number) {
        this._phoneNumber = value;
    }

    get image(): Subject<Blob> {
        return this._image;
    }

    set image(value: Subject<Blob>) {
        this._image = value;
    }

    public getFullName(): string {
        if (this.insertion) {
            return this.firstName + ' ' + this.insertion + ' ' + this.lastName;
        }
        return this.firstName + ' ' + this.lastName;
    }

    public isAdmin(): boolean {
        return this.role.getName() === 'admin';
    }
}
