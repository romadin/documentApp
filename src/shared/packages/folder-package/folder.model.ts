
export class Folder {
    private _id: number;
    private _name: string;
    private _projectId: number;
    private _isOn: boolean;
    private _documents: number;

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

    public getProjectId(): number {
        return this._projectId;
    }

    public setProjectId(value: number) {
        this._projectId = value;
    }

    public getIsOn(): boolean {
        return this._isOn;
    }

    public setOn(value: boolean) {
        this._isOn = value;
    }

    public getDocuments(): number {
        return this._documents;
    }

    public setDocuments(value: number) {
        this._documents = value;
    }

    public update(data): void {
        this.setId(data.id);
        this.setName(data.name);
        this.setDocuments(data.documents);
    }

}
