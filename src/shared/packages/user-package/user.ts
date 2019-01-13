export class User {

    public constructor() {
        //
    }

    get id(): number {
        return this.id;
    }

    set id(value: number) {
        this.id = value;
    }

    get firstName(): string {
        return this.firstName;
    }

    set firstName(value: string) {
        this.firstName = value;
    }

    get insertion(): string {
        return this.insertion;
    }

    set insertion(value: string) {
        this.insertion = value;
    }

    get lastName(): string {
        return this.lastName;
    }

    set lastName(value: string) {
        this.lastName = value;
    }

    get email(): string {
        return this.email;
    }

    set email(value: string) {
        this.email = value;
    }

    get roleId(): number {
        return this.roleId;
    }

    set roleId(value: number) {
        this.roleId = value;
    }

    public getFullName(): string {
        return this.firstName + ' ' + this.insertion !== '' ? this.insertion + ' ' + this.lastName : this.lastName;
    }
}
