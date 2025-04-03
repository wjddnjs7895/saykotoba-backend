export abstract class BaseModel {
  private _id: number;
  private _createdAt: Date;
  constructor({ id, createdAt }: { id: number; createdAt: Date }) {
    this._id = id;
    this._createdAt = createdAt;
  }

  get id(): number {
    return this._id;
  }

  get createdAt(): Date {
    return this._createdAt;
  }
}
