export class Role {
    private _id;
    private _name;

    constructor() {
        //
    }

    getId(): number {
        return this._id;
    }

    setId(id: number) {
        this._id = id;
    }

    getName(): string {
        return this._name;
    }

    setName(name: string) {
        this._name = name;
    }
}
