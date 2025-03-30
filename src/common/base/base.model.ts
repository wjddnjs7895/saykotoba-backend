export abstract class BaseModel {
  private id: number;
  private createdAt: Date;
  constructor({ id, createdAt }: { id: number; createdAt: Date }) {
    this.id = id;
    this.createdAt = createdAt;
  }

  getId(): number {
    return this.id;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }
}
